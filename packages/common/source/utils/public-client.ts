import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    gql,
} from "@apollo/client/core";

import type { Session } from "../types";

import { googleClientTypes } from "./constants";

const LOGIN_WITH_GOOGLE = gql`
    mutation LoginWithGoogle($token: String!, $client: ClientType!) {
        loginWithGoogle(token: $token, client: $client) {
            jwtToken
            user {
                id
                firstName
                lastName
                description
                gender
                countryCode
                pictureURL
                emailAddress
                emailVerified
                birthday
                status
                createdAt
                updatedAt
            }
            createdAt
        }
    }
`;

const GET_AUTH_SERVICES = gql`
    query GetAppByName($name: String) {
        getAppByName(name: $name) {
            authServices {
                googleAuth {
                    clientId
                }
            }
        }
    }
`;

export default class PublicClient {
    appName: string;
    client: ApolloClient<any>;

    constructor(appName: string) {
        this.appName = appName;
        this.client = new ApolloClient({
            link: new HttpLink({
                uri: `http://localhost:3001/graphql/v1/public`,
                fetch,
            }),
            cache: new InMemoryCache(),
        });
    }

    loginWithGoogle = async (
        token: string,
        client: typeof googleClientTypes[number],
    ): Promise<Session> => {
        const {
            data: { loginWithGoogle: session },
        } = await this.client.mutate({
            mutation: LOGIN_WITH_GOOGLE,
            variables: { token, client },
        });
        delete session.__typename;
        delete session.user.__typename;
        return session;
    };

    getAuthInfo = async (): Promise<any> => {
        try {
            const { data } = await this.client.query({
                query: GET_AUTH_SERVICES,
                variables: { name: this.appName },
            });
            const clientId = data.getAppByName.authServices.googleAuth.clientId;
            const authData = [
                {
                    type: "google-oauth",
                    payload: {
                        clientId,
                    },
                },
            ];
            return authData;
        } catch (error) {
            return null;
        }
    };
}

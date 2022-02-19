import * as yup from "yup";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Button, Card, CardContent, Divider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import { FunctionComponent, ReactElement, useCallback } from "react";
import { useGoogleLogin } from "react-google-login";
import { Link, useNavigate } from "react-router-dom";

import { TextField } from "../../components";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "calc(100vh - 64px)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    textAlign: "center",

    fontWeight: "bold",
    fontSize: 20,
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontWeight: 400,
    textAlign: "center",
    marginTop: theme.spacing(1),

    fontSize: 12,
}));

const FormContainer = styled("div")(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2),
}));

const InputField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
    textTransform: "none",
    width: "100%",
}));

const Links = styled("div")(({ theme }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: `${theme.spacing(2)} 0px ${theme.spacing(2)} 0px`,
}));

const DecoratedLink = styled(Link)(({ theme }) => ({
    color: "white",
    fontSize: 12,
}));

const DecoratedDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const LOGIN_WITH_GOOGLE = gql`
    mutation LoginWithGoogle($token: String!) {
        loginWithGoogle(token: $token, client: web) {
            jwtToken
            user {
                id
            }
            createdAt
        }
    }
`;

const client = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}/graphql/v1/public`,
    cache: new InMemoryCache(),
});

interface FormValues {
    email: string;
    password: string;
}

const initialValues: FormValues = {
    email: "",
    password: "",
};

const validationSchema = yup.object({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
});

const Login: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();

    const onSuccess = useCallback(
        async (response: any) => {
            const result = await client.mutate({
                mutation: LOGIN_WITH_GOOGLE,
                variables: { token: response.code },
            });
            delete result.data.loginWithGoogle.__typename;
            delete result.data.loginWithGoogle.user.__typename;
            localStorage.setItem(
                "session",
                JSON.stringify(result.data.loginWithGoogle),
            );
            navigate("/organizations/new");
        },
        [navigate],
    );

    const onFailure = (event: any) => {};

    const { signIn } = useGoogleLogin({
        onSuccess,
        onFailure,
        clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || "",
        cookiePolicy: "single_host_origin",
        // isSignedIn: true,
        responseType: "code",
    });

    const handleContinueWithGoogle = useCallback(() => {
        signIn();
    }, [signIn]);

    const handleBasicAuthSubmit = useCallback(() => {
        return null;
    }, []);

    return (
        <Root>
            <Card>
                <CardContent>
                    <SectionTitle>Please login to continue</SectionTitle>
                    <FormContainer>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleBasicAuthSubmit as any}
                            validationSchema={validationSchema}
                        >
                            {(formik) => (
                                <>
                                    <InputField
                                        id="Email"
                                        label="Email"
                                        variant="outlined"
                                        name="email"
                                        onChange={formik.handleChange}
                                        size="small"
                                        help=""
                                    />
                                    <InputField
                                        id="Password"
                                        label="Password"
                                        variant="outlined"
                                        name="password"
                                        onChange={formik.handleChange}
                                        size="small"
                                        help=""
                                    />
                                    <PrimaryAction
                                        onClick={() => formik.submitForm()}
                                        variant="contained"
                                        size="medium"
                                    >
                                        Login
                                    </PrimaryAction>
                                </>
                            )}
                        </Formik>
                    </FormContainer>
                    <Links>
                        <DecoratedLink to="/create-account">
                            Create Account
                        </DecoratedLink>
                        <DecoratedLink to="/recover-password">
                            Recover Password
                        </DecoratedLink>
                    </Links>
                    <DecoratedDivider />
                    <SectionSubtitle>
                        Alternatively, you can continue with a social account
                    </SectionSubtitle>
                    <PrimaryAction
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={handleContinueWithGoogle}
                    >
                        Continue with Google
                    </PrimaryAction>
                </CardContent>
            </Card>
        </Root>
    );
};

export default Login;

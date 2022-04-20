import type { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useCallback, useContext, useState } from "react";

import { Button, Icon, List } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { useParams } from "react-router-dom";

import { BuilderActionsContext } from "../../../../contexts";

import QueryTemplate from "./QueryTemplate";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const GET_QUERY_TEMPLATES = gql`
    query GetQueryTemplates($app: ID!, $page: Int, $limit: Int) {
        getQueryTemplates(app: $app, page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
            }
        }
    }
`;

const Queries: FunctionComponent = (): ReactElement => {
    const { appId } = useParams();

    const { createTab } = useContext(BuilderActionsContext);

    const { data } = useQuery(GET_QUERY_TEMPLATES, {
        variables: {
            page: 0,
            limit: 20,
            app: appId,
        },
    });
    const { records } = data?.getQueryTemplates || { records: [] };

    const handleNewQuery = useCallback(() => {
        createTab("new-query");
    }, [createTab]);

    const handleEditQuery = useCallback((queryTemplateId: string) => {
        createTab("edit-query", { queryTemplateId });
    }, []);

    const handleDeleteQuery = useCallback((queryTemplateId: string) => {
        console.log("delete");
    }, []);

    return (
        <div>
            <List dense={true}>
                {records.map((query: any) => (
                    <QueryTemplate
                        key={query.id}
                        id={query.id}
                        name={query.name}
                        onEdit={handleEditQuery}
                        onDelete={handleDeleteQuery}
                    />
                ))}
            </List>
            <Actions>
                <Button
                    size="small"
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    endIcon={<Icon>add</Icon>}
                    onClick={handleNewQuery}
                >
                    Create New Query
                </Button>
            </Actions>
        </div>
    );
};

export default Queries;

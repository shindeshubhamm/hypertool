import type { FunctionComponent, ReactElement } from "react";

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import type { Hypertool, Route as HypertoolRoute } from "../types";

import Instantiate from "./Instantiate";

export interface Props {
    screens?: {
        error404: string;
    };
    resolver: (path: string) => Promise<any>;
    layouts?: {
        [key: string]: (element: ReactElement) => ReactElement;
    };
}

const defaultProps = {
    screens: {
        error404: "/error/404",
    },
    layouts: {},
};

const ApplicationRouter: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { screens, resolver, layouts } = props;

    const renderRoute = (route: HypertoolRoute) => {
        const { uri, path } = route;
        const sanitizedUri = uri.replace("@", ":");

        return (
            <Route
                key={uri}
                path={sanitizedUri}
                element={
                    <Instantiate
                        path={path}
                        resolver={resolver}
                        layouts={layouts}
                    />
                }
            />
        );
    };

    const renderRoutes = () => {
        const hypertool = (window as any).hypertool as Hypertool;
        return hypertool.routes.map(renderRoute);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrowserRouter>
                <Routes>
                    {renderRoutes()}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={
                                    screens?.error404 ??
                                    defaultProps.screens.error404
                                }
                            />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

ApplicationRouter.defaultProps = defaultProps;

export default ApplicationRouter;

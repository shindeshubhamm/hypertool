import React from "react";

import { TNodeID } from "../../../../../craft";
import { EventHandlerConnectors } from "../../../../../craft-utils";
import { LayerHandlers } from "../events/LayerHandlers";

export type TLayerContext = {
    id: TNodeID;
    depth: number;
    connectors: EventHandlerConnectors<LayerHandlers, React.ReactElement>;
};

export const LayerContext = React.createContext<TLayerContext>(
    {} as TLayerContext,
);

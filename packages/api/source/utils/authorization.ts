import type { IUser } from "@hypertool/common";
import { ForbiddenError, InternalServerError } from "@hypertool/common";

import type { IAuthResourceGroup } from "../types";

const groups: IAuthResourceGroup[] = [
    {
        name: "appBuilder",
        resources: [
            {
                name: "controllers",
                operations: [
                    {
                        name: "create",
                        test: async (user, app) =>
                            user._id.toString() === app.creator.toString(),
                    },
                    {
                        name: "list",
                        test: async (user, app) =>
                            user._id.toString() === app.creator.toString(),
                    },
                    {
                        name: "listByIds",
                        test: async (user, items) => {
                            const userId = user._id.toString();
                            for (const item of items) {
                                if (item.creator.toString() !== userId) {
                                    return false;
                                }
                            }
                            return true;
                        },
                    },
                    {
                        name: "view",
                        test: async (user, context) =>
                            user._id.toString() === context.id.toString(),
                    },
                    {
                        name: "update",
                        test: async (user, context) =>
                            user._id.toString() === context.id.toString(),
                    },
                    {
                        name: "delete",
                        test: async (user, context) =>
                            user._id.toString() === context.id.toString(),
                    },
                ],
            },
        ],
    },
];

const checkPermission = async (
    permission: string,
    user: IUser,
    context?: any,
): Promise<boolean> => {
    const [groupName, resourceName, operationName] = permission.split(".");

    const group = groups.find((group) => group.name === groupName);
    if (!group) {
        throw new InternalServerError(
            `Unknown resource group "${groupName}" in permission "${permission}".`,
        );
    }

    const resource = group.resources.find(
        (resource) => resource.name === resourceName,
    );
    if (!resource) {
        throw new InternalServerError(
            `Unknown resource "${resourceName}" in permission "${permission}".`,
        );
    }

    const operation = resource.operations.find(
        (operation) => operation.name === operationName,
    );
    if (!operation) {
        throw new InternalServerError(
            `Unknown operation "${operationName}" in permission "${permission}".`,
        );
    }

    return await operation.test(user, context);
};

export const checkPermissions = async (
    user: IUser,
    permissions: string | string[],
    contexts: any[] = [],
): Promise<void> => {
    const permissions0 =
        typeof permissions === "string" ? permissions.split(",") : permissions;
    if (permissions0.length !== contexts.length) {
        throw new Error("Permissions and contexts must have the same length.");
    }

    const promises = [];
    for (let i = 0; i < permissions0.length; i++) {
        const permission = permissions0[i];
        const context = contexts[i];
        const promise = checkPermission(permission, user, context);
        promises.push(promise);
    }

    const deniedList = (await Promise.all(promises))
        .map((result, index) => (result ? null : permissions0[index]))
        .filter((value) => !!value);
    if (deniedList.length > 0) {
        throw new ForbiddenError(
            `The following permissions are required to complete the requested operation: ${deniedList.join(
                ", ",
            )}.`,
        );
    }
};

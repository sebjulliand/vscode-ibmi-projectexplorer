/*
 * (c) Copyright IBM Corp. 2023
 */

import { ExtensionContext, commands, workspace } from "vscode";
import { ProjectManager } from "./projectManager";

/**
 * Represents all IBM i Project Explorer configuration sections.
 */
export enum ConfigurationSection {
    disableUserLibraryListView = "disableUserLibraryListView"
}

/**
 * Represents a manager for IBM i Project Explorer configurations.
 */
export namespace ConfigurationManager {
    /**
     * Initialize the configuration manager by setting up the listener for configurations
     * changes.
     * 
     * @param context An extension context.
     */
    export function initialize(context: ExtensionContext) {
        context.subscriptions.push(
            workspace.onDidChangeConfiguration(async event => {
                if (event.affectsConfiguration(`IBM i Project Explorer.${ConfigurationSection.disableUserLibraryListView}`)) {
                    const disableUserLibraryListView = ConfigurationManager.get(ConfigurationSection.disableUserLibraryListView);

                    if (disableUserLibraryListView) {
                        const activeProject = ProjectManager.getActiveProject();
                        await commands.executeCommand('setContext', 'code-for-ibmi:libraryListDisabled', activeProject ? true : false);
                    } else {
                        await commands.executeCommand('setContext', 'code-for-ibmi:libraryListDisabled', false);
                    }
                }

                if (event.affectsConfiguration(`code-for-ibmi.clearErrorsBeforeBuild`)) {
                    const clearErrorsBeforeBuild = await workspace.getConfiguration(`code-for-ibmi`).get('clearErrorsBeforeBuild');
                    await commands.executeCommand('setContext', 'vscode-ibmi-projectexplorer:clearErrorsBeforeBuild', clearErrorsBeforeBuild);
                }
            })
        );
    }

    /**
     * Get the value of an IBM i Project Explorer configuration section.
     * 
     * @param section The configuration section.
     * @return The value of the section or `undefined`.
     */
    export function get(section: ConfigurationSection) {
        return workspace.getConfiguration(`IBM i Project Explorer`).get(section);
    }
}
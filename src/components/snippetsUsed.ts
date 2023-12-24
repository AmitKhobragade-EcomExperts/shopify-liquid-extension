import { window, Uri, workspace } from 'vscode';
import { parseJSON, parseJSONTemplateFile, readDirRecusively } from './parser';

const fs = workspace.fs;
const folders = workspace.workspaceFolders;

async function getAllJsonTemplates() {
    if(!folders){
        return;
    }
    if(!window.activeTextEditor) {
        window.showErrorMessage('Error:: open a file before running the command');
        return;
    }

   const currentlyOpenTabfilePath = window.activeTextEditor.document.uri;
   const templateJSON = await parseJSONTemplateFile(currentlyOpenTabfilePath);

    console.log(templateJSON);

}

export function snippetsUsed() {
    getAllJsonTemplates();
}

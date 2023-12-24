import { Liquid } from 'liquidjs'; 
import { Uri, workspace } from 'vscode';

const fs = workspace.fs;
const folders = workspace.workspaceFolders;

interface LiquidSection {
    type: string,
    settings: any,
    disabled?: boolean,
    [key: string]: any
}

function generateLiquidEngine(): Liquid {
    const engine = new Liquid();
    return engine;
}

async function readFile(path: Uri): Promise<string> {
    return (await fs.readFile(path)).toString();
}

export async function readDirRecusively(dir: string): Promise<Uri[] | undefined> {
    if(!folders) {
        return;
    }

    const files: Uri[] = [];
    const baseURI: Uri = Uri.joinPath(folders[0].uri, dir);
    const entries = await fs.readDirectory(baseURI);
    
    for (const entry of entries) {
        if(entry[1] > 1) {
            const subDirFiles = await readDirRecusively(dir + '/' + entry[0]);
            if(!subDirFiles) {
                continue;
            }
            files.push(...subDirFiles);
        } else {
            files.push(Uri.joinPath(baseURI, entry[0]));
        }
    }

    return files;
}

export async function parseJSON(path: Uri):Promise<any> {
    return JSON.parse(await readFile(path));
}

export async function parseLiquid(path: Uri, config: any): Promise<string> {
    const liquidEngine = generateLiquidEngine();
    const fileContents = await readFile(path);

    return liquidEngine.renderFileSync(fileContents, config);
}

export async function parseJSONTemplateFile(path: Uri): Promise<LiquidSection[]> {
    const rawTemplate = await parseJSON(path);
    return Object.values<LiquidSection>(rawTemplate.sections);
}

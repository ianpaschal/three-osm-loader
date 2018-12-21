import { Geometry, LoadingManager } from "three";
declare class OSMLoader {
    manager: LoadingManager;
    onError: Function;
    /**
     * Create a new instance of OSMLoader.
     */
    constructor(manager?: LoadingManager);
    /**
     * Load the data, convert it to JSON, pass it to the build() method, and return the result.
     * @param path
     * @param onError
     * @param onProgress
     * @param onLoad
     */
    load(path: string, onError?: Function, onProgress?: Function, onLoad?: Function): void;
    parse(data: any): void;
    build(input: any): Geometry[];
}
export default OSMLoader;

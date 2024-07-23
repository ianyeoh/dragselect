import { defineConfig } from "vite";

export default defineConfig({
    // override default ("/") to allow GitHub pages to work properly
    // see: https://stackoverflow.com/questions/16316311/github-pages-and-relative-paths
    // and https://stackoverflow.com/questions/69744253/vite-build-always-using-static-paths
    base: "",
});

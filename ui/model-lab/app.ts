import { mount } from "svelte";
import { catalog, version } from "model-lab-catalog";
import App from "../svelte/App.svelte";
import "./app.css";

const target = document.getElementById("app");
if (!target) throw new Error("Model Lab root element is missing.");
mount(App, { target, props: { entries: catalog, version: version } });

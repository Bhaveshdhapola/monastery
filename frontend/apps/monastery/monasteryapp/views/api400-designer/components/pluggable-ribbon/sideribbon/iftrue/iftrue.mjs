/** 
 * (C) 2020 TekMonks. All rights reserved.
 */
import {util} from "/framework/js/util.mjs";
import {newFlowNode} from "../../lib/flowNode.mjs";

const parentNode = newFlowNode();
const init = async _ => {await parentNode.init("iftrue", util.getModulePath(import.meta)); return true;}
export const iftrue = {init, ...parentNode};
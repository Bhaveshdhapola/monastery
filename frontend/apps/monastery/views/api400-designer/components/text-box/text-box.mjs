/**
 * (C) 2022 TekMonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */

import { monkshu_component } from "/framework/js/monkshu_component.mjs";
import { dialog_box } from "../../../shared/components/dialog-box/dialog-box.mjs";
import { i18n } from "/framework/js/i18n.mjs";

const DIALOG_HOST_ID = "__org_monkshu_dialog_box";

function addTextBox(id,required, value) {  
  const parentContainer = _getParentContainer(), placeHolder = id, inputElement = _createElement(parentContainer, id, value, placeHolder,"text-box","dynamic","text",required);
  parentContainer.appendChild(inputElement);
}

function addTextBoxesForMap(textBoxValues) {
  const parentContainer = _getParentContainer(), idArray = ["string", "start", "count", "repetition", "function"],
    placeHolderArray = ["String Variable", "Start Pos", "Num of Char", "Repetition No", "String Function"],
    classNameArray = ["stringbox", "startbox", "countbox", "repetitionbox", "functionbox"],
    placeHolderTypeArray = ["dynamic", "static", "static", "static", "static"],
    valueType=["text","text","text","text","text"],
    required = ["true","true","true","true","false"],


  divElement = _createDivElement(parentContainer, idArray, placeHolderArray, classNameArray, placeHolderTypeArray, textBoxValues, "map",valueType,required);
  parentContainer.appendChild(divElement);
};

function addTextBoxesForScrKeys(textBoxValues) {
  const parentContainer = _getParentContainer(), idArray = ["y", "x", "key"],
    placeHolderArray = ["y-cordinate", "x-cordinate", "Key"],
    classNameArray = ["y-cordinates", "x-cordinates", "Keys"],
    placeHolderTypeArray = ["static", "static", "dynamic"],
    valueType=["text","text","text"],
    required = ["true","true","true"],


    divElement = _createDivElement(parentContainer, idArray, placeHolderArray, classNameArray, placeHolderTypeArray, textBoxValues, "scr-keys",valueType,required);
  parentContainer.appendChild(divElement);
};

function addTextBoxesForScrRead(textBoxValues) {
  const parentContainer = _getParentContainer(), idArray = ["screen-row-from", "screen-col-from", "screen-row-to", "screen-col-to"],
    placeHolderArray = ["Screen Row From", "Screen Col From", "Screen Row To", "Screen Col To"],
    classNameArray = ["rows-from", "cols-from", "rows-to", "cols-to"],
    placeHolderTypeArray = ["dynamic", "dynamic", "dynamic", "dynamic"],
    valueType=["text","text","text","text"],
    required = ["true","true","true","true"],
    divElement = _createDivElement(parentContainer, idArray, placeHolderArray, classNameArray, placeHolderTypeArray, textBoxValues, "scr-read",valueType,required);
  parentContainer.appendChild(divElement);
};

function addContainerForRunsqlprc(variable, natureOfParm, typeOfParam) {
  const parentContainer = _getParentContainer(), divElement = _createDivElementForRunsqlPrc(parentContainer,variable, natureOfParm, typeOfParam);
  parentContainer.appendChild(divElement);
};

function _createElement(parentContainer, id, value, placeHolder, className, placeHolderType, type,required) {
  // "oninvalid":"this.setCustomValidity('{{i18n.FillField}}')" , "oninput":"setCustomValidity('')","required":"true","class":"validate"
  const inputElement = document.createElement("input");
   inputElement.setAttribute("type", `${type}`);
  //  inputElement.setAttribute("required","true")

  if(type=="text"){
    inputElement.setAttribute("oninvalid",`this.setCustomValidity(${i18n.get('FillField')}  )`)
    inputElement.setAttribute("oninput","setCustomValidity('')");

  };
  if(type=="number") {inputElement.setAttribute("oninvalid",`this.setCustomValidity(${i18n.get('FillNum')})`);
  inputElement.setAttribute("oninput","setCustomValidity('')")
  }
  inputElement.setAttribute("id", `${id}-${parentContainer.children.length + 1}`);
  if (placeHolderType == "static") inputElement.setAttribute("placeholder", placeHolder);
  else inputElement.setAttribute("placeholder", `${placeHolder}-${parentContainer.children.length + 1}`);
  if (value != undefined) inputElement.setAttribute("value", `${value}`);
  if (required == "true") inputElement.setAttribute("required", true);
  if (className != undefined) inputElement.setAttribute("class", `${className} validate`);
  return inputElement;
};

function _getParentContainer() {
  const dialogShadowRoot = dialog_box.getShadowRootByHostId(DIALOG_HOST_ID);
  const parentContainer = dialogShadowRoot.querySelector("div#page-contents");
  return parentContainer;
}

function _createDivElement(parentContainer, idArray, placeHolderArray, classNameArray, placeHolderTypeArray, textBoxValues, classNameForDiv,valueType,required) {
  const divElement = document.createElement("div");
  divElement.setAttribute("class", classNameForDiv);
  for (let i = 0; i < idArray.length; i++) {
    let inputElement;
    if (textBoxValues != undefined) inputElement = _createElement(parentContainer, idArray[i], textBoxValues[i], placeHolderArray[i], classNameArray[i], placeHolderTypeArray[i],valueType[i],required[i]);
    else inputElement = _createElement(parentContainer, idArray[i], textBoxValues, placeHolderArray[i], classNameArray[i], placeHolderTypeArray[i],valueType[i],required[i]);
    divElement.append(inputElement);
  }
  return divElement;
}

function _createDivElementForRunsqlPrc(parentContainer, variable, natureOfParm, typeOfParam) {
  const divElement = document.createElement("div");
  divElement.setAttribute("class", 'runsqlprc');
  const inputElement1 = _createElement(parentContainer, "variable", variable, "Variable", "variablebox","dynamic","text","true"),
  selectElement1 = _createDropDownElement(parentContainer, "nature"),
  selectElement2 = _createDropDownElement(parentContainer, "type");
  divElement.append( inputElement1,selectElement1, selectElement2);

  if (natureOfParm != undefined) {
    for (let i = 0; i < selectElement1.options.length; ++i)  if (selectElement1.options[i].text == natureOfParm.slice(1))
      selectElement1.options[i].selected = true;
  }
  if (typeOfParam != undefined) {
    for (let i = 0; i < selectElement2.options.length; ++i) if (selectElement2.options[i].text == typeOfParam.slice(1))
      selectElement2.options[i].selected = true;
  }
  return divElement;
}

function _createDropDownElement(parentContainer, type) {
  const selectElement = document.createElement("select");
  if (type == "nature") selectElement.innerHTML = ' <option value="" selected   >Nature Of Param</option> <option value="&IN">IN</option><option value="&OUT">OUT</option><option value="&INOUT">INOUT</option>';
  else selectElement.innerHTML = ' <option value="" selected  >Type Of Param </option> <option value=":NUM">NUM</option><option value=":CHAR">CHAR</option>';
  selectElement.setAttribute("id", `${type}-${parentContainer.children.length + 1}`);
  selectElement.setAttribute("class", type);
  return selectElement;
}

export const text_box = {
  trueWebComponentMode: true,
  addTextBox,
  addTextBoxesForScrKeys,
  addTextBoxesForMap,
  addTextBoxesForScrRead,
  addContainerForRunsqlprc

};

monkshu_component.register(
  "text-box",
  null,
  text_box
);

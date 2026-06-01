
// dom.js – utilitários de seleção e criação de elementos
'use strict';
 
export const $ = (id) => document.getElementById(id);
export const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
 
export function createElement(tag, className = '', attributes = {}, children = []) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child instanceof Node) el.appendChild(child);
  });
  return el;
}
 

// will contain all functions that can be used in any file
import {TIMEOUT_SEC}  from "./config.js";
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

 export const getJson=async function(url){
 try {
      const apiResponse = await  Promise.race([fetch(url),timeout(TIMEOUT_SEC)]) ;
      const recipeData = await apiResponse.json();
 
      if (!apiResponse.ok) throw new Error(`${recipeData.message}`);
      return recipeData;
      
 } catch (error) {
    throw error;
 }
}

export const sendJson=async function(url,uploadData){
  try {
       const apiResponse = await  Promise.race([fetch(url,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(uploadData)
       }),timeout(TIMEOUT_SEC)]) ;
       const recipeData = await apiResponse.json();
  
       if (!apiResponse.ok) throw new Error(`${recipeData.message}`);
       return recipeData;
       
  } catch (error) {
     throw error;
  }
 }

 
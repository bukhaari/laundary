import { createAction } from "@reduxjs/toolkit";

export const apiBegan = createAction("api/CallBegan");
export const onSuccess = createAction("api/onSuccess");
export const OnError = createAction("api/onError");

import * as csx from 'csx';

export const white = '#FFF';
export const black = '#000';
export const lightGray = '#ECEFF1';
export const buttonGray = csx.lightgray.darken('5%').toString();
export const buttonHoverGray = csx.lightgray.toString();
export const toolbarGray = csx.lightgray.lighten('5%').toString();
export const darkGray = csx.black.lighten('50%').toString();
import legal from '../data/legal.json';
import support from '../data/support.json';
import shippingReturns from '../data/shipping-returns.json';
import sizeGuide from '../data/size-guide.json';
import warranty from '../data/warranty.json';
import accessibility from '../data/accessibility.json';

export const getLegalPages = async () => legal;
export const getSupportPage = async () => support;
export const getShippingReturns = async () => shippingReturns;
export const getSizeGuide = async () => sizeGuide;
export const getWarranty = async () => warranty;
export const getAccessibility = async () => accessibility;

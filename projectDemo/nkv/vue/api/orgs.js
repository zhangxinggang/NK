import ajax from '../utils/ajax'
export const optOrgs=(obj)=>ajax('/LNBiz/servers/background/org/otbOptionOrgs',obj,'post');
export const getAllOrgs=(obj)=>ajax('/LNBiz/servers/background/org/getAllOrgs',obj,'post');
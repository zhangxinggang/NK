import ajax from '../utils/ajax'
export const getOrgRoles=()=>ajax('/LNBiz/servers/background/role/getOrgRoles');
export const obtOptionRoles=(obj)=>ajax('/LNBiz/servers/background/role/otbOptionRoles',obj,'post');

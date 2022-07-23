import { useState, useEffect } from 'react';
import useSWR from 'swr';

import { PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';
import { teslaApi } from '../../api';

const UsersPage = () => {

  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if ( data ) {
      setUsers(data);
    }
  }, [data]);
  

  if ( !data && !error) return <>Cargando...</>;

  const onRoleUpdate = async( userId: string, newRole: string ) => {
    
    const previosUsers = users.map( user => ({ ...user }));
    const updatedUsers = users.map( user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }));

    setUsers(updatedUsers);

    try {
      await teslaApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      setUsers( previosUsers );
      console.log('No se pudo actualizar el role del usaurio ', error);
    }
  }
  
  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {

        return (
          <Select
            value={ row.role }
            label="Role"
            onChange={ ({ target }) => onRoleUpdate( row.id, target.value )}
            sx={{ width: '300px' }}
          >
            <MenuItem value='admin'>admin</MenuItem>
            <MenuItem value='super-user'>Super User</MenuItem>
            <MenuItem value='CEO'>CEO</MenuItem>
            <MenuItem value='client'>client</MenuItem>
          </Select>
        )
      }
    },
  ];

  const rows = users.map( user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout
      title='usuarios'
      subtitle='Mantenimiento de usuarios'
      icon={ <PeopleOutline /> }      
    >

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={ rows }
            columns={ columns }
            pageSize={ 10 }
            rowsPerPageOptions={ [10] }
          />
        </Grid>
      </Grid>

    </AdminLayout>
  )
}

export default UsersPage
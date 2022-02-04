import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

import 'devextreme/data/odata/store';
import DataGrid, { Column, Paging, Pager, Editing, Popup, Scrolling, Selection, Sorting, FilterRow, HeaderFilter, SearchPanel, Lookup, Toolbar, Item } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';
import themes from 'devextreme/ui/themes';
import { employees, states } from './data';

// ! dataSource
//#region DataSource
function App() {
  const allowedPageSizes = [2, 8, 12, 20];

  const applyFilterTypes = [{
    key: 'auto',
    name: 'Immediately',
  }, {
    key: 'onClick',
    name: 'On Button Click',
  }];

  const [showFilterRow, setFilterRow] = useState(true);
  const [showHeaderFilter, setHeaderFilter] = useState(true);
  const [currentFilter, setcurrentFilter] = useState(applyFilterTypes[0].key);
  const [isAddButtonVisible, setAddButtonVisible] = useState(true);
  const [isUpdateButtonVisible, setUpdateButtonVisible] = useState(true);   //изменить
  const [isDeleteButtonVisible, setDeleteButtonVisible] = useState(true);   //изменить
  const [selectedState, setSelectedState] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  // const [selectedStateId, setSelectedStateId] = useState('');

  const dataGridRef = useRef();   // todo

  const data = new DataSource({
    store: employees,
  })

  const addButtonOptions = {
    icon: 'plus',
    onClick: () => {
      console.log('Click!');
    }
  }
  const updateButtonOptions = {
    icon: 'refresh',
    onClick: () => {
      console.log('updated');
    }
  }
  const deleteButtonOptions = {
    icon: 'minus',
    onClick: () => {
      console.log('Delete!');
    }
  }

  const statesList = states.map((state) => state['Name']);


  console.log(`selectedState ---   ${selectedState}`);

  useEffect(
    () => {
      const stateId = states.find((state) => state['Name'] === selectedState && state['ID']);   //* тут не правильно
      console.log(`state id -- ${stateId}`);
      const selEmploy = employees.filter(employee => employee['StateID'] === stateId?.['ID']);
      console.log(`selected--${selEmploy}`);
      setSelectedEmployees(selEmploy);
    },
    [selectedState]
  )
  

  // console.log(selectedStateObj);
  // // const employeesList = employees.map((employee, i) => employees[i].LastName);
  // const selectedStateId = selectedStateObj.ID;
  // console.log(selectedStateId);
  // const selectedEmployees = employees.filter((employee, i) => employee['StateID'] === selectedStateId);
  // console.log(selectedEmployees);

  return (
    <>
      <DataGrid
        dataSource={data}
        keyExpr="ID"
        showBorders={true}
        remoteOperations={true}
        ref={dataGridRef}  // todo
      >
        <Toolbar>
          <Item location="after" widget="dxButton" options={addButtonOptions} visible={isAddButtonVisible} />
          <Item location="after" widget="dxButton" options={updateButtonOptions} visible={isUpdateButtonVisible} />
          <Item location="after" widget="dxButton" options={deleteButtonOptions} visible={isDeleteButtonVisible} />
        </Toolbar>
        <FilterRow
          visible={showFilterRow}
          applyFilter={currentFilter}
        />
        <HeaderFilter
          visible={showHeaderFilter}
        />
        <Selection mode="multiple"
          selectAllMode="AllMode"
        />

        <SearchPanel visible={true}
          width={240}
          placeholder="Search..." />

        <Column dataField="Prefix" caption="Title" width={70} />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="BirthDate" dataType="date" />
        <Column dataField="Position" width={170} />
        <Column dataField="HireDate" dataType="date" />
        <Column dataField="StateID" caption="State" width={125}>
          <Lookup dataSource={states} valueExpr="ID" displayExpr="Name" />
        </Column>
        <Column dataField="Address" visible={true} />
        <Column dataField="Notes" visible={false} />

        <Editing
          mode="row"
          allowDeleting={true}
          allowAdding={true}
          allowUpdating={true}
        >
          {/* <Popup
              title="Info_list" showTitle={true} width={700} height={525}
            /> */}
        </Editing>
        <Sorting mode="multiple" />
        <Scrolling mode="infinite" />
        <Paging defaultPageSize={12} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={allowedPageSizes}
        />
      </DataGrid>
      <div className='reloadButton'>
        <Button
          icon="refresh"
          width={170}
          height={50}
          text="Press to reload"
          type="success"
          stylingMode="contained"
          onClick={() => {
            console.log(dataGridRef.current.instance);
            dataGridRef.current.instance.refresh()      // todo
          }}
        />
      </div>
      <hr />
      <div className='selectBoxes'>
        <SelectBox
          items={statesList}
          placeholder='Choose your state'
          showClearButton={true}
          value={selectedState}
          onValueChanged={(event) => {
            setSelectedState(event.value)
          }}
        />
        <SelectBox
          items={selectedEmployees}
          placeholder='Employees name'
        />
      </div>
    </>
  );
}
export default App;
//#endregion

// ! CustomStore (from server) ------------------------------------------------
//#region CustomStore
// function App() {

// const allowedPageSizes = [2, 8, 12, 20];

//   function isNotEmpty(value) {
//     return value !== undefined && value !== null && value !== '';
//   }

//   const store = new CustomStore({
//     key: 'OrderNumber',
//     load(loadOptions) {
//       let params = '?';
//       [
//         'skip',
//         'take',
//         'requireTotalCount',
//         'requireGroupCount',
//         'sort',
//         'filter',
//         'totalSummary',
//         'group',
//         'groupSummary',
//       ].forEach((i) => {
//         if (i in loadOptions && isNotEmpty(loadOptions[i])) { params += `${i}=${JSON.stringify(loadOptions[i])}&`; }
//       });
//       params = params.slice(0, -1);
//       return fetch(`https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders${params}`)
//         .then((response) => response.json())
//         .then((data) => ({
//           data: data.data,
//           totalCount: data.totalCount,
//           summary: data.summary,
//           groupCount: data.groupCount,
//         }))
//         .catch(() => { throw new Error('Data Loading Error'); });
//     },
//   });

//   const applyFilterTypes = [{
//     key: 'auto',
//     name: 'Immediately',
//   }, {
//     key: 'onClick',
//     name: 'On Button Click',
//   }];

//   const [showFilterRow, setFilterRow] = useState(true);
//   const [showHeaderFilter, setHeaderFilter] = useState(true);
//   const [currentFilter, setcurrentFilter] = useState(applyFilterTypes[0].key);
//   const [isAddButtonVisible, setAddButtonVisible] = useState(true);
//   const [isUpdateButtonVisible, setUpdateButtonVisible] = useState(false);   //изменить
//   const [isDeleteButtonVisible, setDeleteButtonVisible] = useState(false);   //изменить
//   const [checkBoxesMode, setCheckBoxesMode] = useState(themes.current().startsWith('material') ? 'always' : 'onClick');
//   console.log(checkBoxesMode);

//   const addButtonOptions = {
//     icon: 'plus',
//     onClick: () => {
//       console.log('Click!');
//     }
//   }

//   const updateButtonOptions = {
//     icon: 'refresh',
//     onClick: () => {
//       console.log('updated');
//     }
//   }

//   const deleteButtonOptions = {
//     icon: 'minus',
//     onClick: () => {
//       console.log('Delete!');
//     }
//   }

//   return (
//     <>
//       <DataGrid
//         keyExpr="ID"
//         dataSource={store}
//         showBorders={true}
//         remoteOperations={true}
//       >
//         <Toolbar>
//           <Item location="after" widget="dxButton" options={addButtonOptions} visible={isAddButtonVisible} />
//           <Item location="after" widget="dxButton" options={updateButtonOptions} visible={isUpdateButtonVisible} />
//           <Item location="after" widget="dxButton" options={deleteButtonOptions} visible={isDeleteButtonVisible} />
//         </Toolbar>
//         <FilterRow
//           visible={showFilterRow}
//           applyFilter={currentFilter}
//         />
//         <HeaderFilter
//           visible={showHeaderFilter}
//         />
//         <Selection
//           mode="multiple"
//           selectAllMode="AllMode"
//           showCheckBoxesMode={checkBoxesMode}
//         />
//         <Column
//           dataField="OrderNumber"
//           dataType="number"
//           width={150}
//         />
//         <Column
//           dataField="OrderDate"
//           dataType="date"
//         />
//         <Column
//           dataField="StoreCity"
//           dataType="string"
//         />
//         <Column
//           dataField="StoreState"
//           dataType="string"
//         />
//         <Column
//           dataField="Employee"
//           dataType="string"
//         />
//         <Column
//           dataField="SaleAmount"
//           dataType="number"
//           alignment="center"
//           format="currency"
//         />

//         <SearchPanel visible={true}
//           width={240}
//           placeholder="Search..." />

//         <Editing
//           mode="row"
//           allowDeleting={true}
//           allowAdding={true}
//           allowUpdating={true}
//         >
//           {/* <Popup
//           title="Info_list" showTitle={true} width={700} height={525}
//         /> */}
//         </Editing>
//         {/* <Scrolling mode="infinite" /> */}

//         <Sorting mode="multiple" />
//         <Paging defaultPageSize={12} />
//         <Pager
//           showPageSizeSelector={true}
//           allowedPageSizes={allowedPageSizes}
//         />
//       </DataGrid>
//       <div className='reloadButton'>
//         <Button
//           icon="refresh"
//           width={170}
//           height={50}
//           text="Press to reload"
//           type="success"
//           stylingMode="contained"
//           onClick={() => { document.location.reload() }}
//         />
//       </div>
//     </>
    
//   );
// }

// export default App;

//#endregion
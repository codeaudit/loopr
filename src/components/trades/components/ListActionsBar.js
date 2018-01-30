import React from 'react';
import ListFiltersForm from './ListFiltersForm'
import {Button} from 'antd'

function ListActionsBar({actions={},LIST={}}){
  return (
    <div>
    	<div className="row ml0 mr0">
    		<div className="col-auto">
    				<ListFiltersForm actions={actions} LIST={LIST} />
    		</div>
    		<div className="col-auto">

    		</div>
    		<div className="col">
    		</div>
    	</div>
    </div>
  );
}
export default ListActionsBar;

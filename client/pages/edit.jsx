import React from 'react';
import EditExpense from '../components/edit-expense';

export default class EditView extends React.Component {
  render() {
    return (
      <div className='container'>
        <EditExpense editEntryId={this.props.editEntryId} updateEditedFrontEnd={this.props.updateEditedFrontEnd}/>
      </div>
    );
  }
}
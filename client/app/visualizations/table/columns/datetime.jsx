import React from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import Input from 'antd/lib/input';
import ContextHelp from '@/components/visualizations/editor/ContextHelp';
import { createDateTimeFormatter } from '@/lib/value-format';

function Editor({ column, onChange }) {
  const [onChangeDebounced] = useDebouncedCallback(onChange, 200);

  return (
    <React.Fragment>
      <div className="m-b-15">
        <label htmlFor={`table-column-editor-${column.name}-datetime-format`}>
          Date/Time format
          <ContextHelp.DateTimeFormatSpecs />
        </label>
        <Input
          id={`table-column-editor-${column.name}-datetime-format`}
          data-test="Table.ColumnEditor.DateTime.Format"
          defaultValue={column.dateTimeFormat}
          onChange={event => onChangeDebounced({ dateTimeFormat: event.target.value })}
        />
      </div>
    </React.Fragment>
  );
}

Editor.propTypes = {
  column: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dateTimeFormat: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function initDateTimeColumn(column) {
  const format = createDateTimeFormatter(column.dateTimeFormat);

  function prepareData(row) {
    return {
      text: format(row[column.name]),
    };
  }

  function DateTimeColumn({ row }) { // eslint-disable-line react/prop-types
    const { text } = prepareData(row);
    return text;
  }

  DateTimeColumn.prepareData = prepareData;

  return DateTimeColumn;
}

initDateTimeColumn.friendlyName = 'Date/Time';
initDateTimeColumn.Editor = Editor;

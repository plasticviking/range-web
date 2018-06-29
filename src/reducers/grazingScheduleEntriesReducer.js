import { STORE_PLAN, ADD_GRAZING_SCHEDULE_ENTRY } from '../constants/actionTypes';

const storeGrazingScheduleEntries = (state, action) => {
  const { grazingScheduleEntries } = action.payload.entities;

  return {
    byId: {
      ...state.byId,
      ...grazingScheduleEntries,
    },
  };
};

const addGrazingScheduleEntry = (state, action) => {
  const { grazingScheduleEntry } = action.payload;
  return {
    byId: {
      ...state.byId,
      [grazingScheduleEntry.id]: grazingScheduleEntry,
    },
  };
};

const grazingScheduleEntriesReducer = (state = {
  byId: {},
}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeGrazingScheduleEntries(state, action);
    case ADD_GRAZING_SCHEDULE_ENTRY:
      return addGrazingScheduleEntry(state, action);
    default:
      return state;
  }
};

export default grazingScheduleEntriesReducer;

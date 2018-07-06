import { cloneDeep } from 'lodash';
import * as actionTypes from '../constants/actionTypes';
import { getReferencesFromLocalStorage } from '../utils';

const initialState = {
  references: getReferencesFromLocalStorage(),
  zones: {},
  zoneIds: [],
  users: {},
  userIds: [],
};

const updateZone = (state, action) => {
  const zone = cloneDeep(action.payload);
  return {
    ...state,
    zones: {
      ...state.zones,
      [zone.id]: zone,
    },
  };
};

const storeZones = (state, action) => {
  const { entities, result } = action.payload;
  const { zones } = entities;
  return {
    ...state,
    zones: {
      ...zones,
    },
    zoneIds: [
      ...result,
    ],
  };
};

const updateUser = (state, action) => {
  const user = cloneDeep(action.payload);
  return {
    ...state,
    users: {
      ...state.users,
      [user.id]: user,
    },
  };
};

const storeUsers = (state, action) => {
  const { entities, result } = action.payload;
  const { users } = entities;
  return {
    ...state,
    users: {
      ...users,
    },
    userIds: [
      ...result,
    ],
  };
};

const commonStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STORE_REFERENCES:
      return {
        ...state,
        references: {
          ...action.payload,
        },
      };
    case actionTypes.STORE_ZONES:
      return storeZones(state, action);
    case actionTypes.UPDATE_ZONE:
      return updateZone(state, action);
    case actionTypes.STORE_USERS:
      return storeUsers(state, action);
    case actionTypes.UPDATE_USER:
      return updateUser(state, action);
    default:
      return state;
  }
};

// private selectors
export const getZones = state => state.zoneIds.map(id => state.zones[id]);
export const getZonesMap = state => state.zones;
export const getReferences = state => state.references;
export const getUsers = state => state.userIds.map(id => state.users[id]);
export const getUsersMap = state => state.users;

export default commonStoreReducer;

import {usersAPI} from "../api/api";
import {updateObjectInArray} from "../Utils/object-helper";

const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';
const SET_USERS = 'SET_USERS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_TOTAL_USERS_COUNT = 'SET_TOTAL_USERS_COUNT';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_FOLLOWING_PROGRESS = 'TOGGLE_IS_FOLLOWING_PROGRESS';


let initialState = {
    usersData: [],
    pageSize: 7,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: false,
    followingInProgress: []
};

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case FOLLOW:
            return {
                ...state,
                usersData: updateObjectInArray(
                    state.usersData,
                    action.userID,
                    'id',
                    {followed: true})
            };
        case UNFOLLOW:
            return {
                ...state,
                usersData: updateObjectInArray(
                    state.usersData,
                    action.userID,
                    'id',
                    {followed: false})
            };
        case SET_USERS: {
            return {...state, usersData: action.usersData};
        }
        case SET_CURRENT_PAGE: {
            return {...state, currentPage: action.currentPage};
        }
        case SET_TOTAL_USERS_COUNT: {
            return {...state, totalUsersCount: action.count};
        }
        case TOGGLE_IS_FETCHING: {
            return {...state, isFetching: action.isFetching};
        }
        case TOGGLE_IS_FOLLOWING_PROGRESS: {
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.userId]
                    : state.followingInProgress.filter(id => id != action.userId)
            };
        }

        default:
            return state;
    }
};


export const followSuccess = (userID) => ({type: FOLLOW, userID});
export const unfollowSuccess = (userID) => ({type: UNFOLLOW, userID});
export const setUsers = (usersData) => ({type: SET_USERS, usersData});
export const setCurrentPage = (currentPage) => ({type: SET_CURRENT_PAGE, currentPage});
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching});
export const setTotalUsersCount = (totalUsersCount) => ({type: SET_TOTAL_USERS_COUNT, count: totalUsersCount});
export const toggleFollowingProgress = (isFetching, userId) => ({
    type: TOGGLE_IS_FOLLOWING_PROGRESS,
    isFetching,
    userId
});

export const getUsers = (currentPage, pageSize) => async (dispatch) => {
    dispatch(toggleIsFetching(true));
    let data = await usersAPI.getUsers(currentPage, pageSize);
    dispatch(toggleIsFetching(false));
    dispatch(setUsers(data.items));
    dispatch(setTotalUsersCount(data.totalCount / 10));
};

export const followUnfollowFlow = async (dispatch, userId, apiMethod, actionCreator) => {
    dispatch(toggleFollowingProgress(true, userId));
    let response = await apiMethod(userId);
    if (response.data.resultCode === 0) {
        dispatch(actionCreator(userId))
    }
    dispatch(toggleFollowingProgress(false, userId));
};

export const follow = (userId) => async (dispatch) => {
    await followUnfollowFlow(dispatch, userId, usersAPI.follow.bind(usersAPI), followSuccess)
};

export const unfollow = (userId) => async (dispatch) => {
    await followUnfollowFlow(dispatch, userId, usersAPI.unfollow.bind(usersAPI), unfollowSuccess);

};

export default usersReducer;



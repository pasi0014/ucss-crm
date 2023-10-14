/**
 * File contains calls for the Login Form Component
 */

import { UCSS_API_CONSTANTS } from '../../utils/constants';

interface IUser {
  email: String;
  phone: String;
  password: String;
}

export const registerUser = async ({ user }: { user: IUser }) => {
  const logContext = {
    component: `components/Login.calls.registerUser`,
    params: { user }
  } as Object;

  try {
    const requestURL: String = `${UCSS_API_CONSTANTS.HOST}/${UCSS_API_CONSTANTS.VERSION}/users`;
    // call api here
    // const response = await
    console.log(``);
  } catch (error) {
    console.error(`Unexpected error while trying to register User`, {
      ...logContext,
      error
    });
  }
};

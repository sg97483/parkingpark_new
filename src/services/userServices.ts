import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL, IS_ANDROID} from '~constants/constant';
import {GENDER, IS_ACTIVE} from '~constants/enum';
import {
  CarInsuranceInfo,
  ImageProps,
  QnAProps,
  RoadInDriverUpdateProps,
  RoadUpdateProps,
  UserProps,
  VersionCodeProps,
} from '~constants/types';
import {CarModel} from '~model/car-model';
import {createFormDataToObject} from '~utils/index';

export const userServices = createApi({
  reducerPath: 'userServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    loginWithEmailAndPass: builder.mutation<UserProps, Partial<{email: string; password: string}>>({
      query: ({email, password}) => {
        return {
          url: `sMember/loginEmail?email=${email}&pwd=${password}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listMember: UserProps[]}) => {
        return response.listMember[0];
      },
    }),
    updateUserFCMToken: builder.mutation<any, {memberId: string; fcmToken: string}>({
      query: ({fcmToken, memberId}) => {
        return {
          url: 'fcm/putFcmToken/',
          method: 'POST',
          params: {memberId, fcmToken},
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    getUserInfo: builder.query<UserProps, Partial<{id: number; password: string}>>({
      query: ({id, password}) => {
        return {
          url: `sMember/readMyProfile/?id=${id}&pwd=${password}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listMember: UserProps[]}) => {
        if (response.listMember[0]) {
          return response.listMember[0];
        } else {
          return {} as UserProps;
        }
      },
    }),

    editUserInfo: builder.mutation<
      string,
      Partial<{
        photo?: ImageProps;
        nickname?: string;
        age?: string | null;
        gender?: GENDER;
        phone?: string;
        agreeMarketingMail?: IS_ACTIVE;
        agreeMarketingSMS?: IS_ACTIVE;
        agreeHappyCall?: IS_ACTIVE;
        userID: number;
        userPassword: string; // Partial로 인해 string | undefined가 됩니다.
        carNumber?: string;
        carModel?: string;
        carColor?: string;
        partnerCarList?: string;
      }>
    >({
      query({
        age,
        agreeHappyCall,
        agreeMarketingMail,
        agreeMarketingSMS,
        gender,
        nickname,
        phone,
        photo,
        userID,
        userPassword, // 여기서 userPassword는 string | undefined 타입입니다.
        carColor,
        carModel,
        carNumber,
        partnerCarList,
      }) {
        const formData = new FormData();
        if (nickname) {
          formData.append('nic', nickname);
        }

        if (age) {
          formData.append('age', age);
        }

        if (phone) {
          formData.append('pnum', phone);
        }

        if (agreeMarketingMail) {
          formData.append('agreeMarketingMailYN', agreeMarketingMail);
        }

        if (agreeMarketingSMS) {
          formData.append('agreeMarketingSmsYN', agreeMarketingSMS);
        }

        if (agreeHappyCall) {
          formData.append('agreeHappyCallYN', agreeHappyCall);
        }

        if (gender) {
          formData.append('gender', gender);
        }

        formData.append('id', String(userID));

        // ❗ userPassword가 undefined가 아닐 때만 'pwd' 필드를 추가합니다.
        if (userPassword !== undefined) {
          formData.append('pwd', userPassword);
        }
        // 만약 API가 'pwd' 필드를 항상 요구한다면,
        // userPassword가 undefined일 때 빈 문자열을 보내거나 (API 명세에 따라 다름)
        // 또는 이 함수를 호출하는 쪽에서 반드시 userPassword 값을 제공하도록 해야 합니다.

        if (photo && photo.uri && photo.fileName) {
          const photoData: any = {
            uri: IS_ANDROID ? photo.uri : photo.uri.replace('file://', ''),
            name: photo.fileName,
            type: photo.type || 'image/png',
          };
          formData.append('photo', photoData);
        }

        if (carColor) {
          formData.append('carColor', carColor);
        }

        if (carNumber) {
          formData.append('carNumber', carNumber);
        }

        if (carModel) {
          formData.append('carModel', carModel);
        }

        if (partnerCarList) {
          formData.append('partnerCarList', partnerCarList);
        }

        return {
          url: 'sMember/update',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response.statusCode;
      },
    }),
    updateAgreement: builder.mutation<
      any,
      Partial<{
        agreeMarketingMail: IS_ACTIVE;
        agreeMarketingSMS: IS_ACTIVE;
        userID: number;
      }>
    >({
      query: ({agreeMarketingMail, agreeMarketingSMS, userID}) => {
        const url = 'sMember/agreeYNUpdate';

        const formData = new FormData();
        // userID를 문자열로 변환
        formData.append('id', String(userID));

        if (agreeMarketingMail !== undefined) {
          formData.append('agreeMarketingMailYN', agreeMarketingMail);
        }
        if (agreeMarketingSMS !== undefined) {
          formData.append('agreeMarketingSmsYN', agreeMarketingSMS);
        }

        return {
          url: url,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response.statusCode;
      },
    }),
    getProfileUser: builder.mutation<UserProps, Partial<{id: number}>>({
      query: ({id}) => {
        return {
          url: `sMember/read?id=${id}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {listMember: UserProps[]}) => {
        return response.listMember[0];
      },
    }),
    updateCarUser: builder.mutation<
      any,
      Partial<{
        id: number;
        pwd: string;
        carNumber: string;
        carModel: string;
        carColor: string;
        carYear: string;
        carCompany: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sMember/update',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    readUserPass: builder.query<UserProps, Partial<{id: string}>>({
      query: ({id}) => {
        return {
          url: `sMember/readPass?id=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listMember: UserProps[]}) => {
        return response?.listMember[0];
      },
    }),
    readMyDriver: builder.query<
      CarInsuranceInfo,
      Partial<{
        memberId: string;
      }>
    >({
      query: ({memberId}) => {
        return {
          url: 'sDriver/readMyDriver',
          method: 'GET',
          params: {memberId},
        };
      },
      transformResponse: (response: {listDriver: CarInsuranceInfo[]}) => {
        return response?.listDriver[0];
      },
    }),
    readMyProfile: builder.mutation<
      any,
      Partial<{
        id: string;
        pwd: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sMember/readMyProfile',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any) => {
        return response?.listMember[0];
      },
    }),
    driverLicenseUpdate: builder.mutation<
      boolean,
      Partial<{
        memberId: string;
        licenseNum: string;
        licenseKind: string;
        licenseEndDate: string;
        licenseAuthNum: string;
        jumin: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/driverLicenseUpdate',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any) => {
        return response?.statusCode === '200';
      },
    }),
    driverInsurUpdate: builder.mutation<
      boolean,
      Partial<{
        insurDriverYN: string;
        insurPersonalAmt: string;
        insurDriverName: string;
        memberId: string;
        insurCompany: string;
        insurEndDate: string;
        insurPropertyAmt: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/driverInsurUpdate',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateImageUser: builder.mutation<any, Partial<any>>({
      query: body => {
        const url = body?.url;
        delete body.url;
        const formData = createFormDataToObject(body);
        return {
          url: url,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateCarImages: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
        carImageUrl: string;
        carImageUrl2: string;
        carImageUrl3: string;
        carImageUrl4: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/updateDriverImageCar',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    readMyCMember: builder.mutation<any, Partial<{memberId: string}>>({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/readCMember',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {listCMember: any[]}) => {
        return response?.listCMember[0];
      },
    }),
    createCMember: builder.mutation<
      boolean,
      Partial<{
        memberId: string;
        realName: string;
        jumin: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/createCMember',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    changeUserPassword: builder.mutation<
      string,
      Partial<{id: number; oldPassword: string; newPassword: string}>
    >({
      query: ({id, newPassword, oldPassword}) => {
        const formData = new FormData();
        // id를 문자열로 변환하고, undefined가 아닌지 확인
        if (id !== undefined) {
          formData.append('id', String(id));
        }
        if (oldPassword !== undefined) {
          // oldPassword도 undefined 체크 (선택 사항이지만 안전)
          formData.append('oldPassword', oldPassword);
        }
        if (newPassword !== undefined) {
          // newPassword도 undefined 체크 (선택 사항이지만 안전)
          formData.append('newPassword', newPassword);
        }

        return {
          url: 'sMember/updatePassword',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),

    readMyDriverName: builder.mutation<
      any,
      Partial<{
        memberId: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/readMyDriverName',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),

    updateDriver: builder.mutation<
      any,
      Partial<{
        memberId: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/updateDriver',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    updateDriverAuth: builder.mutation<
      any,
      Partial<{
        memberId: string;
        authYN: string;
        vcAuthYN?: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/updateDriverAuth',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    createDrivingRoad: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/createDrivingRoad',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    createDriverImage: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/createDriverImage',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    createRidingRoad: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/createRidingRoad',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    updateMemberAuth: builder.mutation<
      any,
      Partial<{
        memberId: string;
        authYN: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);
        return {
          url: 'sDriver/updateMemberAuth',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    getDatabaseVersion: builder.query<number, void>({
      query: () => {
        return {
          url: 'check/getPlot',
          method: 'GET',
        };
      },
      transformResponse: (response: {version: number}) => {
        return response?.version;
      },
    }),
    getVersionInfo: builder.query<VersionCodeProps, void>({
      query: () => {
        return {
          url: 'check/versionCode',
          method: 'GET',
        };
      },
      transformResponse: (response: {update: VersionCodeProps}) => {
        return response?.update;
      },
    }),
    deleteAccount: builder.mutation<
      any,
      Partial<{
        id: string;
        pwd: string;
      }>
    >({
      query: body => {
        return {
          url: 'sMember/secession',
          method: 'POST',
          body: createFormDataToObject(body),
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    eGiveMoneyYN: builder.mutation<
      any,
      Partial<{
        id: string;
        pwd: string;
        mpoint: string;
      }>
    >({
      query: body => {
        return {
          url: 'sMember/mpointUpdate',
          method: 'POST',
          body: createFormDataToObject(body),
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    firebaseTokenUpdate: builder.mutation<any, {deviceToken: string; email: string}>({
      query: ({deviceToken, email}) => {
        return {
          url: 'sDriver/firebaseTokenUpdate',
          method: 'PUT',
          body: {
            deviceToken,
            email,
          },
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    updateLicenseImage: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
        licenseImageUrl: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateDriverImageLicense',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateProfileImage: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
        profileImageUrl: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateDriverImageProfile',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateDriverInsuranceImage: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
        insurImageUrl: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateDriverImageInsur',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateDriverBank: builder.mutation<
      any,
      Partial<{
        memberId: string;
        bankNum: string;
        bankName: string;
        pName: string;
        calYN: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/driverBankUpdate',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateDriverBankImage: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
        bankImageUrl: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateDriverImageBank',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateDriverStyle: builder.mutation<
      any,
      Partial<{
        memberId: string;
        style: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/driverStyleUpdate',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),

    updateDriverImageRider: builder.mutation<
      any,
      Partial<{c_memberId: string; bcImageUrl: string; vaccineImageUrl: string}>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateDriverImageRider',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response;
      },
    }),
    updateDriverImageVC: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
        vaccineImageUrl: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateDriverImageVc',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),

    updateCMember: builder.mutation<any, Partial<{termsYN: string; memberId: string}>>({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateCMember',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateDriverImageBC: builder.mutation<
      any,
      Partial<{
        c_memberId: string;
        bcImageUrl: string;
      }>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateDriverImageBc',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode === '200';
      },
    }),
    updateCMemberInfo: builder.mutation<
      any,
      Partial<{memberId?: number; jobType: string; job: string; coName: string; coAddress: string}>
    >({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/updateCMemberInfo',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response;
      },
    }),
    ridingRoadUpdateIn: builder.mutation<any, Partial<RoadUpdateProps>>({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/ridingRoadUpdateIn',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response;
      },
    }),
    ridingRoadUpdateOut: builder.mutation<any, Partial<RoadUpdateProps>>({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/ridingRoadUpdateOut',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response;
      },
    }),
    drivingRoadUpdateIn: builder.mutation<any, Partial<RoadInDriverUpdateProps>>({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/drivingRoadUpdateIn',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response;
      },
    }),
    drivingRoadUpdateOut: builder.mutation<any, Partial<RoadInDriverUpdateProps>>({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/drivingRoadUpdateOut',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response;
      },
    }),
    getListReadYN: builder.query<QnAProps[], Partial<{memberId: number | string}>>({
      query: ({memberId}) => {
        return {
          url: `valetQnaBbs/getListReadYN/?memberId=${memberId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: any) => {
        return response?.list || [];
      },
    }),
    readYNQnA: builder.mutation<QnAProps[], Partial<{id: number | string}>>({
      query: ({id}) => {
        return {
          url: `valetQnaBbs/readYNupdate/?readYN=Y&id=${id}`,
          method: 'POST',
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    getMyRegisterdCar: builder.query<CarModel[], Partial<{memberId: number}>>({
      query: ({memberId}) => {
        return {
          url: 'sMember/readMyCarManager/',
          method: 'GET',
          params: {memberId},
        };
      },
      transformResponse: (response: {listCarManager: CarModel[]}) => {
        return response?.listCarManager ?? [];
      },
    }),
    deleteMyCar: builder.mutation<string, Partial<{id: number; memberId: number}>>({
      query: ({id, memberId}) => {
        return {
          url: 'sMember/delCarManager/',
          method: 'DELETE',
          params: {
            id,
            memberId,
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode ?? '';
      },
    }),
    setDefaultCard: builder.mutation<string, Partial<{id: number; memberId: number}>>({
      query: ({id, memberId}) => {
        return {
          url: 'sMember/updateMainCarYN',
          method: 'PATCH',
          params: {
            id,
            memberId,
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode ?? '';
      },
    }),
    addNewCar: builder.mutation<
      string,
      Partial<{
        memberId: number;
        carNumber: string;
        carModel: string;
        carColor: string;
        carYear: string;
        carCompany: string;
      }>
    >({
      query: ({carColor, carCompany, carModel, carNumber, carYear, memberId}) => {
        return {
          url: 'sMember/createCarManager/',
          method: 'POST',
          params: {carColor, carCompany, carModel, carNumber, carYear, memberId},
        };
      },
    }),
    checkAuthDriverAndPassenger: builder.mutation<
      {authDriver: string; authPassenger: string},
      Partial<{memberId: any; id: any}>
    >({
      query: ({id, memberId}) => {
        return {
          url: 'sDriver/readMyRiderRoadInfo/',
          method: 'GET',
          params: {memberId, id},
        };
      },
      transformResponse: (response: {listDriver: {authYN: string; riderAuthYN: string}[]}) => {
        return {
          authDriver: response?.listDriver[0]?.authYN,
          authPassenger: response?.listDriver[0]?.riderAuthYN,
        };
      },
    }),
  }),
});

export const {
  useEditUserInfoMutation,
  useLoginWithEmailAndPassMutation,
  useUpdateUserFCMTokenMutation,
  useGetUserInfoQuery,
  useUpdateAgreementMutation,
  useGetProfileUserMutation,
  useUpdateCarUserMutation,
  useReadUserPassQuery,
  useReadMyDriverQuery,
  useLazyReadMyDriverQuery,
  useDriverInsurUpdateMutation,
  useChangeUserPasswordMutation,
  useUpdateImageUserMutation,
  useDriverLicenseUpdateMutation,
  useReadMyCMemberMutation,
  useCreateCMemberMutation,
  useReadMyDriverNameMutation,
  useUpdateDriverMutation,
  useCreateDrivingRoadMutation,
  useCreateDriverImageMutation,
  useReadMyProfileMutation,
  useGetDatabaseVersionQuery,
  useGetVersionInfoQuery,
  useDeleteAccountMutation,
  useEGiveMoneyYNMutation,
  useFirebaseTokenUpdateMutation,
  useUpdateCarImagesMutation,
  useUpdateLicenseImageMutation,
  useUpdateProfileImageMutation,
  useUpdateDriverInsuranceImageMutation,
  useUpdateDriverBankMutation,
  useUpdateDriverBankImageMutation,
  useUpdateDriverStyleMutation,
  useCreateRidingRoadMutation,
  useUpdateMemberAuthMutation,
  useUpdateDriverImageRiderMutation,
  useUpdateCMemberMutation,
  useUpdateCMemberInfoMutation,
  useUpdateDriverImageVCMutation,
  useUpdateDriverImageBCMutation,
  useRidingRoadUpdateInMutation,
  useRidingRoadUpdateOutMutation,
  useDrivingRoadUpdateInMutation,
  useDrivingRoadUpdateOutMutation,
  useUpdateDriverAuthMutation,
  useGetListReadYNQuery,
  useReadYNQnAMutation,
  useGetMyRegisterdCarQuery,
  useDeleteMyCarMutation,
  useSetDefaultCardMutation,
  useAddNewCarMutation,
  useCheckAuthDriverAndPassengerMutation,
} = userServices;

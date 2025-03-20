import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {

    try {

      //logic to save changes in db
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      }


      //api call
      const { data } = await axios.post(backendUrl + "/api/doctor/update-profile", updateData, {
        headers: { dToken }
      })

      if (data.success) {

        toast.success(data.message)
        setIsEdit(false)
        getProfileData()

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (dToken) {
      getProfileData(dToken);
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col m-5 gap-4">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white shadow-lg">
            {/* doctors info */}
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>

            {/* doctor about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>

            <p className="text-gray-600 mt-4 font-medium">
              Appointment Fees:
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    className="bg-slate-200 px-2 py-1 w-full rounded-sm"
                    type="number"
                    name=""
                    id=""
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2 w-full mt-2">
              <p>Address:</p>
              <p className="text-sm w-full">
                {isEdit ? (
                  <input
                    className="bg-slate-200 px-2 py-1 w-full rounded-sm"
                    value={profileData.address.line1}
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line1: e.target.value,
                        },
                      }))
                    }
                  ></input>
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    className="bg-slate-200 px-2 py-1 mt-1 w-full rounded-sm"
                    value={profileData.address.line2}
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line2: e.target.value,
                        },
                      }))
                    }
                  ></input>
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className="flex items-center gap-1 mt-2">
              <input
                onChange={() => isEdit && setProfileData((prev) => ({ ...prev, available: !prev.available }))}
                className="w-4 h-4"
                checked={profileData.available}
                type="checkbox"
                name=""
                id=""
                readOnly
              />
              <label className="" htmlFor="">
                Available
              </label>
            </div>

            {
              isEdit
                ? <button
                  onClick={updateProfile}
                  type="button"
                  className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  Save
                </button>
                : <button
                  onClick={() => setIsEdit(true)}
                  type="button"
                  className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  Edit
                </button>

            }
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;

import moment from "moment";
import { IMG_URL } from "../../../../config";

export default function CustomerView({ data, toggleModal }) {
  console.log(data);
  return (
    <div className="container rounded bg-white">
  <div className="row">
    <div className="col-md-12 py-3">
      <div className="info-view">
        <div className="row">
          <div className="col-md-6">
            <h2 className="eventViewhead">
              <i className="bi bi-circle-fill circleIcon"></i> Details
            </h2>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <div className="form-group">
              <img
                width={140}
                height={120}
                className="img-thumbnail"
                src={IMG_URL + data?.image ?? ""}
                alt="Customer"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <ul className="list-group">
              <li className="list-group-item">
                <span className="fw-bold">Name:</span> {data?.name ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Email:</span> {data?.email ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Mobile:</span> {data?.mobileno ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Address:</span> {data?.address ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Temporary Address:</span>{" "}
                {data?.t_address ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">WhatsApp No:</span>{" "}
                {data?.whatsapp_no ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Alternate No:</span>{" "}
                {data?.alternate_no ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Aadhar No:</span>{" "}
                {data?.aadhar_no ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Other ID:</span> {data?.other_id ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">PAN No:</span> {data?.pan_no ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Date of Birth:</span> {data?.dob ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Date of Anniversary:</span>{" "}
                {data?.doa ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Bill Date:</span>{" "}
                {data?.bill_date ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Cash:</span> {data?.cash ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Online Payment:</span>{" "}
                {data?.online ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Payment Method:</span>{" "}
                {data?.payment_method ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Area:</span> {data?.area ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Block:</span> {data?.block ?? ""}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Apartment:</span> {data?.apartment ?? ""}
              </li>
             
            </ul>
          </div>
          <div className="col-md-6">
            <ul className="list-group">
              
              <li className="list-group-item">
                <span className="fw-bold">Front Aadhar Image:</span>{" "}
                {data?.frontAadharImage ? (
                  <img
                    src={IMG_URL + data.frontAadharImage}
                    alt="Front Aadhar"
                    width="150"
                    height={"100"}
                  />
                ) : (
                  "N/A"
                )}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Back Aadhar Image:</span>{" "}
                {data?.backAadharImage ? (
                  <img
                    src={IMG_URL + data.backAadharImage}
                    alt="Back Aadhar"
                    width="150"
                    height={"100"}
                  />
                ) : (
                  "N/A"
                )}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">PAN Image:</span>{" "}
                {data?.panImage ? (
                  <img src={IMG_URL + data.panImage} alt="PAN" width="150"
                  height={"100"}  />
                ) : (
                  "N/A"
                )}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Other ID Image:</span>{" "}
                {data?.otherIdImage ? (
                  <img
                    src={IMG_URL + data.otherIdImage}
                    alt="Other ID"
                    width="150"
                    height={"100"}
                  />
                ) : (
                  "N/A"
                )}
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Signature:</span>{" "}
                {data?.signature ? (
                  <img
                    src={IMG_URL + data.signature}
                    alt="Signature"
                    width="150"
                    height={"100"}
                  />
                ) : (
                  "N/A"
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

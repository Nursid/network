import React from 'react';
import {BiLogoWhatsapp} from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
const Invoice = React.forwardRef((props, ref) => {
  const { data } = props;
  const currentDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata', // Specify the desired time zone
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Display time in 12-hour format
  });

    return (
      <>
       
  <div className='container d-flex flex-column justify-content-between' style={{ maxWidth: "210mm", margin: "0 auto", height: "100vh" }} ref={ref}>
    {/* Main Content */}
    <div>
      <div className="row">
        <div className="receipt-main col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3 w-100">
          <div className="row">
            <div className="receipt-header d-flex">
              <div className="col-md-8">
                <div className="receipt-left">
                  <div className=''>
                    <img
                      className="img-responsive mr-4"
                      alt="iamgurdeeposahan"
                      src="/wireless-route.jpeg"
                      width={300}
                    />
                  </div>
                
                  <figcaption>
                    <cite title="Source Title"><FaLocationDot size={16} />Office Address: B 774, Tigri, Dr. Ambedkar Nagar Sector-1, New Delhi-110062</cite>
                  </figcaption>
                  <figcaption>
                    <cite title="Source Title">9211113678
                      {/* <BiLogoWhatsapp color="#25D366" size={20} />
                      9211113678 */}
                    </cite>
                  </figcaption>
                  {/* <p style={{ color: 'blue' }}>www.ssquickhelper.com</p> */}
                </div>
              </div>
              <div className="col-md-4 text-right">
                <div className="receipt-right">
                  <h1>INVOICE</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="receipt-header receipt-header-mid d-flex">
              <div className="col-xs-6 col-sm-6 col-md-6 text-left">
                <div className="">
                  <h4>{data?.name ? data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase() : ''}</h4>
                  <p>
                    <b>Mobile :</b> {data?.mobileno}
                  </p>
                  <p>
                    <b>Member ID :</b> {data?.member_id}
                  </p>
                  <p>
                    <b>Alternate No :</b> {data?.alterno}
                  </p>
                  <p>
                    <b>Email :</b> {data?.email}
                  </p>
                  <p>
                    <b>Address :</b> {data?.service_address}
                  </p>
                </div>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6">
                <div className="receipt-left">
                  <p><b>Date :</b> {currentDate}</p>
                  <p><b>Invoice No :</b> {data?.order_no}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope='col'>Order No.</th>
                  <th scope='col'>Service Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data?.order_no}</td>
                  <td>{data?.service_name}</td>
                </tr>
                <tr>
                  <td className="text-right">
                    <p><strong>Payment Method:</strong></p>
                    <p><strong>Billing Amount:</strong></p>
                    <p><strong>Online Amount:</strong></p>
                    <p><strong>Cash Amount:</strong></p>
                    <p><strong>Balance Amount:</strong></p>
                  </td>
                  <td>
                    <p><strong>{data?.paymethod}</strong></p>
                    <p><strong>{data?.netpayamt}</strong></p>
                    <p><strong>{data?.online}</strong></p>
                    <p><strong>{data?.cash}</strong></p>
                    <p><strong>{data?.totalamt}</strong></p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="row mt-auto mb-4">
      <div className="col-xs-8 col-sm-8 col-md-8 text-left">
        <div>
          <h5 style={{ color: 'rgb(140, 140, 140)' }}>Thank you for choosing Infinity Internet Services!</h5>
        </div>
      </div>
    </div>
  </div>

      </>
     );
    });
    export default Invoice;
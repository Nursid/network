import { API_URL } from "../../../../config";

const TicketView = ({data}) => {
    return (
      <div className="container rounded bg-white">
      <div className="row">
        <div className="col-md-12 py-3">
          <div className="info-view">
            <div className="row">
              <div className="col-md-6">
                <ul className="list-group">
                  <li className="list-group-item">
                    <span className="fw-bold">Customer Name:</span> {data?.customer?.name ?? ""}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">Email:</span> {data?.email ?? ""}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">MobileNo:</span> {data?.mobileNo ?? ""}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">details:</span> {data?.details ?? ""}
                  </li>     

                  <li className="list-group-item">
                    <span className="fw-bold">Address:</span>{data?.customer?.address ?? ""} {data?.customer?.apartment ?? ""} {data?.customer?.t_address ?? ""} {data?.customer?.block ?? ""}
                  </li>                
                              
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-group">
                <li className="list-group-item">
                    <span className="fw-bold">Type:</span> {data?.ticketType ?? ""}
                  </li>  
                <li className="list-group-item">
                    <span className="fw-bold">Time Slot:</span> {data?.timeSlot ?? ""}
                  </li>  
                <li className="list-group-item">
                    <span className="fw-bold">Created Date & Time:</span> {data?.createdAt ?? ""}
                  </li>  
                <li className="list-group-item">
                    <span className="fw-bold">Visit Date & Time:</span> {data?.formattedDate ?? ""}
                  </li>  

                <li className="list-group-item">
                    <span className="fw-bold"> Technician Name:</span> {data?.service_provider?.name ?? ""}
                  </li>  

                <li className="list-group-item">
                    <span className="fw-bold">Technician Mobile:</span> {data?.service_provider?.mobile_no ?? ""}
                  </li>  


                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };
  
  export default TicketView;
  
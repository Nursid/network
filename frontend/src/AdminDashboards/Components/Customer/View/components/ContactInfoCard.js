import React from 'react';
import { Card, CardBody, CardHeader } from "reactstrap";
import * as FaIcons from "react-icons/fa";

const ContactInfoCard = ({ data }) => {
  const ContactField = ({ icon, label, value, color = "text-muted" }) => (
    <div className="contact-field mb-3">
      <div className="d-flex align-items-center">
        <div className={`contact-icon me-3 ${color}`}>
          {icon}
        </div>
        <div>
          <div className="contact-label">{label}</div>
          <div className="contact-value">{value || 'N/A'}</div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardHeader className="bg-light border-0 py-3">
        <div className="d-flex align-items-center">
          <FaIcons.FaPhone className="text-success me-2" size={18} />
          <h6 className="mb-0 fw-semibold">Contact Information</h6>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <ContactField
          icon={<FaIcons.FaMobile size={18} />}
          label="Mobile Number"
          value={data?.mobile}
          color="text-primary"
        />
        <ContactField
          icon={<FaIcons.FaWhatsapp size={18} />}
          label="WhatsApp Number"
          value={data?.whatsapp_no}
          color="text-success"
        />
        <ContactField
          icon={<FaIcons.FaPhoneAlt size={16} />}
          label="Alternate Number"
          value={data?.alternate_no}
          color="text-info"
        />
      </CardBody>
    </Card>
  );
};

export default ContactInfoCard; 
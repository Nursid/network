import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button as BootstrapButton } from 'react-bootstrap'
import { Box, Typography, Button, Grid, Paper, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { 
  Computer, 
  TrendingUp, 
  BarChart, 
  Description, 
  PieChart, 
  LocalOffer,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Build,
  Security,
  VpnKey,
  Menu
} from '@mui/icons-material'
import { BsFillTelephoneFill, BsWhatsapp, BsFacebook } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'

const LandingPage = () => {
  const [show, setShow] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  
  const phoneNumber = '7290900835';
  const whatsappWebURL = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
  const handleButtonClick = () => {
    window.open(whatsappWebURL, '_blank');
  };

  const handleServiceProviderLogin = () => {
    window.open('/admin', '_blank');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const services = [
    {
      icon: <Computer sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#FF6B35' }} />,
      title: "Web/Mobile Interface",
      description: "Modern responsive interfaces for all your digital needs"
    },
    {
      icon: <TrendingUp sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#FF6B35' }} />,
      title: "Business Consultancy in Auditory Services",
      description: "Expert guidance for your business growth and optimization"
    },
    {
      icon: <BarChart sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#FF6B35' }} />,
      title: "Platform Insights and Data Analysis",
      description: "Comprehensive analytics and reporting solutions"
    },
    {
      icon: <Description sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#FF6B35' }} />,
      title: "Document Management",
      description: "Streamlined document handling and organization"
    },
    {
      icon: <PieChart sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#FF6B35' }} />,
      title: "CRM Module",
      description: "Customer relationship management solutions"
    },
    {
      icon: <LocalOffer sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#FF6B35' }} />,
      title: "Local Advertisement & Promotion",
      description: "Targeted marketing and promotional campaigns"
    }
  ];

  const features = [
    {
      title: "Transforming the IT Landscape.",
      description: "Engage with us to digitally transform your business with industry specific solutions",
      icon: <Build sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#FF6B35' }} />,
      color: "#FF6B35",
      decorativeShapes: [
        { color: '#FFA726', size: 20, top: '10%', left: '15%', shape: 'hexagon' },
        { color: '#FF7043', size: 15, top: '20%', right: '20%', shape: 'circle' },
        { color: '#FFB74D', size: 25, bottom: '15%', left: '10%', shape: 'hexagon' }
      ]
    },
    {
      title: "Customer centricity is the new adage.",
      description: "LaxDeep's platform helps clients in managing relationships with their customers across the lifecycle",
      icon: <Security sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#4285F4' }} />,
      color: "#4285F4",
      decorativeShapes: [
        { color: '#42A5F5', size: 18, top: '15%', left: '10%', shape: 'hexagon' },
        { color: '#1E88E5', size: 22, top: '25%', right: '15%', shape: 'hexagon' },
        { color: '#64B5F6', size: 16, bottom: '20%', right: '25%', shape: 'hexagon' }
      ]
    },
    {
      title: "Challenge the Norm",
      description: "At LaxDeep, we combine the power of domain, enterprise, and digital technologies to reimagine business potential",
      icon: <VpnKey sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: '#26C6DA' }} />,
      color: "#26C6DA",
      decorativeShapes: [
        { color: '#4DD0E1', size: 20, top: '10%', right: '10%', shape: 'circle' },
        { color: '#00BCD4', size: 24, bottom: '10%', left: '15%', shape: 'circle' },
        { color: '#80DEEA', size: 18, top: '30%', right: '20%', shape: 'circle' }
      ]
    }
  ];

  const newsItems = [
    {
      title: "The atomisation of the television audience",
      description: "The time has finally come. You've poured your blood, sweat, and tears into...",
      date: "June 10, 2025",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Indias cable operators should embrace new technologies",
      description: "The time has finally come. You've poured your blood, sweat, and tears into...",
      date: "June 10, 2025",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Could Cable Come Back With a 'TV-Lite' Future Of Re-aggregation And Upselling?",
      description: "The time has finally come. You've poured your blood, sweat, and tears into...",
      date: "June 10, 2025",
      image: "/api/placeholder/400/250"
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box 
        component="header" 
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          py: { xs: 1, sm: 2 },
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: '#4285F4',
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
              }}
            >
              LAXDEEP
            </Typography>
            
            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}>
                Home
              </Typography>
              <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}>
                About Us
              </Typography>
              <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}>
                Blogs
              </Typography>
              <Typography 
                variant="body1" 
                onClick={handleServiceProviderLogin}
                sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}
              >
                Service Provider Login
              </Typography>
              <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}>
                Contact
              </Typography>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton 
              sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={toggleMobileMenu}
            >
              <Menu />
            </IconButton>
          </Box>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <Box 
              sx={{ 
                display: { xs: 'block', md: 'none' },
                mt: 2,
                py: 2,
                borderTop: '1px solid #e0e0e0'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}>
                  Home
                </Typography>
                <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}>
                  About Us
                </Typography>
                <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}>
                  Blogs
                </Typography>
                <Typography 
                  variant="body1" 
                  onClick={handleServiceProviderLogin}
                  sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}
                >
                  Service Provider Login
                </Typography>
                <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B35' } }}>
                  Contact
                </Typography>
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: { xs: '70vh', sm: '75vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 }
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
                  lineHeight: 1.2,
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Enabling Digital Transformation in the Television and Broadband Ecosystem
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: { xs: 3, sm: 4 },
                  opacity: 0.9,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  lineHeight: 1.5,
                  textAlign: { xs: 'center', md: 'left' },
                  px: { xs: 1, sm: 0 }
                }}
              >
                Empowering digital cable TV companies to become lean and more customer-centric through Enterprise Digital Transformation, Strategy, Consulting, Implementation, and Support.
              </Typography>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#e55a2b'
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: '250px', sm: '300px', md: '400px' },
                  mt: { xs: 3, md: 0 }
                }}
              >
                <Box 
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={'https://tellyon.com/wp-content/uploads/revslider/home-1/rev_1-5.png'} 
                    alt="Hero Illustration" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 }, px: { xs: 2, sm: 0 } }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: { xs: 1, sm: 2 },
                color: '#333',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
              }}
            >
              How Can We Help
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                px: { xs: 1, sm: 0 }
              }}
            >
              Empowering digital cable TV companies to become lean and more customer-centric through Enterprise Digital Transformation, Strategy, Consulting, Implementation, and Support.
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ px: { xs: 1, sm: 0 } }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card 
                  className='p-4' 
                  sx={{
                    height: { xs: '220px', sm: '240px', md: '250px' }, 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    {service.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: { xs: 1, sm: 2 }, 
                      px: 1,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      lineHeight: 1.6, 
                      px: 1,
                      fontSize: { xs: '0.85rem', sm: '0.9rem' }
                    }}
                  >
                    {service.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: { xs: 2, sm: 3 },
                  color: '#333',
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                About Us
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  lineHeight: 1.8,
                  color: '#666',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textAlign: { xs: 'center', md: 'left' },
                  px: { xs: 1, sm: 0 }
                }}
              >
                LaxDeep is a B2B SaaS platform, that enables the digital transformation of the Cable TV & broadband ecosystem. Through multiple interfaces and tools, LaxDeep offers integrated solutions to different stakeholders in the domain.
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  lineHeight: 1.8,
                  color: '#666',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textAlign: { xs: 'center', md: 'left' },
                  px: { xs: 1, sm: 0 }
                }}
              >
                With our cutting-edge knowledge we maximize the benefits of our depth, diversity and delivery capability, ensuring adaptability to all the stakeholders in the ecosystem, and thus bringing out the most innovative solution in Pay TV business and technology domain.
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8,
                  color: '#666',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textAlign: { xs: 'center', md: 'left' },
                  px: { xs: 1, sm: 0 }
                }}
              >
                The platform not only helps everyone in the organization to get connected online but also provides multiple benefits to the subscriber, thus increasing his engagement and satisfaction levels.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  height: { xs: '250px', sm: '300px', md: '400px' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  mt: { xs: 3, md: 0 }
                }}
              >
                <img 
                  src={'https://tellyon.com/wp-content/uploads/2018/11/section_01.png'} 
                  alt="About Us Illustration" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ px: { xs: 1, sm: 0 } }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card 
                  className='p-4' 
                  sx={{
                    height: { xs: '280px', sm: '300px', md: '320px' }, 
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Decorative Shapes - Hidden on mobile for cleaner look */}
                  {feature.decorativeShapes.map((shape, shapeIndex) => (
                    <Box
                      key={shapeIndex}
                      sx={{
                        position: 'absolute',
                        width: `${shape.size}px`,
                        height: `${shape.size}px`,
                        backgroundColor: shape.color,
                        top: shape.top,
                        left: shape.left,
                        right: shape.right,
                        bottom: shape.bottom,
                        borderRadius: shape.shape === 'circle' ? '50%' : '0',
                        transform: shape.shape === 'hexagon' ? 'rotate(45deg)' : 'none',
                        opacity: 0.8,
                        zIndex: 1,
                        display: { xs: 'none', sm: 'block' }
                      }}
                    />
                  ))}
                  
                  {/* Main Icon */}
                  <Box 
                    sx={{ 
                      position: 'relative',
                      zIndex: 2,
                      mb: { xs: 2, sm: 3, md: 4 }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  {/* Content */}
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: { xs: 2, sm: 3 }, 
                        px: 1,
                        color: '#333',
                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ 
                        lineHeight: 1.6, 
                        px: 1,
                        fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Elevate Business Section */}
      <Box sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
              <Box 
                sx={{ 
                  height: { xs: '250px', sm: '300px', md: '400px' },
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={'https://tellyon.com/wp-content/uploads/2018/11/section_04.jpg'} 
                  alt="Business Operations Illustration" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: { xs: 2, sm: 3 },
                  color: '#333',
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Elevate Your Business Operations
              </Typography>
              
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#4285F4',
                      borderRadius: 20,
                      px: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.8rem', sm: '0.9rem' }
                    }}
                  >
                    CHALLENGES
                  </Button>
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 20,
                      px: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.8rem', sm: '0.9rem' }
                    }}
                  >
                    SOLUTION
                  </Button>
                </Box>
                
                <Box sx={{ pl: { xs: 0, md: 2 } }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1, 
                      color: '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    ✦ Fragmented processes and system architecture
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1, 
                      color: '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    ✦ Lack of 360-degree customer view
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1, 
                      color: '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    ✦ Ineffective and inefficient customer facing operations
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    ✦ Lack of relevant KPI dashboards & analytics required for decision making
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* News Section */}
      <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              mb: { xs: 3, sm: 4, md: 6 },
              color: '#333',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Read Our Latest News
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ px: { xs: 1, sm: 0 } }}>
            {newsItems.map((news, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: { xs: '380px', sm: '420px', md: '450px' },
                    width: '100%',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      height: { xs: 160, sm: 180, md: 200 },
                      backgroundColor: '#667eea',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 12, md: 16 },
                        left: { xs: 8, sm: 12, md: 16 },
                        backgroundColor: '#4285F4',
                        color: 'white',
                        px: { xs: 1, sm: 1.5, md: 2 },
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' }
                      }}
                    >
                      LAXDEEP
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        opacity: 0.7,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      News Image
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      p: { xs: 2, sm: 2.5, md: 3 }, 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between' 
                    }}
                  >
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: { xs: 1.5, sm: 2 }, 
                          lineHeight: 1.3,
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                        }}
                      >
                        {news.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: { xs: 1.5, sm: 2 }, 
                          lineHeight: 1.5,
                          fontSize: { xs: '0.85rem', sm: '0.9rem' }
                        }}
                      >
                        {news.description}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        fontWeight: 500, 
                        mt: 'auto',
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }}
                    >
                      {news.date}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
          py: { xs: 4, sm: 5, md: 6 }
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.3rem', sm: '1.5rem' }
                }}
              >
                LAXDEEP
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  opacity: 0.8,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  lineHeight: 1.6
                }}
              >
                LaxDeep is a B2B SaaS platform, that enables the digital transformation of the Cable TV & broadband ecosystem. Through multiple interfaces and tools, LaxDeep offers integrated solutions to different stakeholders in the domain.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }}>
                  <LinkedIn sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Useful Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { textDecoration: 'underline' },
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}
                >
                  Service Provider Login
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { textDecoration: 'underline' },
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}
                >
                  Technician Login
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { textDecoration: 'underline' },
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}
                >
                  Subscriber Login
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                >
                  Email: info@laxdeep.com
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    lineHeight: 1.4
                  }}
                >
                  Contact No.: 9220656991 / 9560560720 / 9220682991 / 9920495838
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Newsletter
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 1,
                    p: { xs: 1, sm: 1.5 }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: { xs: '0.85rem', sm: '0.9rem' }
                    }}
                  >
                    Enter your email
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  sx={{
                    backgroundColor: '#FF6B35',
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    py: { xs: 1, sm: 1.2 },
                    '&:hover': {
                      backgroundColor: '#e55a2b'
                    }
                  }}
                >
                  SUBSCRIBE
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          <Box 
            sx={{ 
              borderTop: '1px solid rgba(255,255,255,0.2)',
              mt: { xs: 3, sm: 4 },
              pt: { xs: 2, sm: 3 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                textAlign: { xs: 'center', sm: 'left' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Terms of use | Privacy Policy for Customers | Legal Disclaimer | Privacy Policy for Partners
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                textAlign: { xs: 'center', sm: 'right' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Copyright © 2025 LaxDeep Media Pvt Ltd. All Rights Reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Floating Action Buttons */}
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 15, sm: 20 }, 
          right: { xs: 15, sm: 20 }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 1.5, sm: 2 }, 
          zIndex: 1000 
        }}
      >
        <IconButton 
          sx={{ 
            backgroundColor: '#1877f2',
            color: 'white',
            width: { xs: 45, sm: 56 },
            height: { xs: 45, sm: 56 },
            '&:hover': { backgroundColor: '#166fe5' }
          }}
        >
          <BsFacebook size={20} />
        </IconButton>
        
        <IconButton 
          onClick={handleButtonClick}
          sx={{ 
            backgroundColor: '#25d366',
            color: 'white',
            width: { xs: 45, sm: 56 },
            height: { xs: 45, sm: 56 },
            '&:hover': { backgroundColor: '#20ba5a' }
          }}
        >
          <BsWhatsapp size={20} />
        </IconButton>
        
        <IconButton 
          onClick={handleShow}
          sx={{ 
            backgroundColor: '#667eea',
            color: 'white',
            width: { xs: 45, sm: 56 },
            height: { xs: 45, sm: 56 },
            '&:hover': { backgroundColor: '#5a6fd8' }
          }}
        >
          <BsFillTelephoneFill size={20} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default LandingPage
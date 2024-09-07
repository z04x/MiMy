import React, { useEffect, useLayoutEffect } from "react";
import { Box, Typography } from "@mui/material";
import { initMainButton } from "@telegram-apps/sdk";
import CheckIcon from '@mui/icons-material/Check';
import { useBackButton } from "../hooks/Chat/useBackButton";
declare const particlesJS: any;
const UpgradePage: React.FC = () => {

  const {setIsVisible } = useBackButton();
  useEffect(() => {
    setIsVisible(true);
    return () => {
      setIsVisible(false);
    };
  }, [setIsVisible]);

  useEffect(() => {
    const [mainButton] = initMainButton();

    if (mainButton) {
      // Настройка MainButton
      mainButton.setText("Upgrade to Professional");
      mainButton.setParams({
        bgColor: "#0AA66E",
        textColor : "#ffffff",
      });

      // Обработчик клика
      const handleUpgrade = () => {
        console.log("Upgrade initiated");
      };

      mainButton.on("click", handleUpgrade);

      // Показываем кнопку
      mainButton.show();

      // Очистка при размонтировании компонента
      return () => {
        mainButton.off("click", handleUpgrade);
        mainButton.hide();
      };
    }
  }, []);



  useLayoutEffect(() => {
    if (typeof particlesJS !== 'undefined') {
      particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 20,
            "density": {
              "enable": true,
              "value_area": 500
            }
          },
          "color": {
            "value": "#00ff00"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 10,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 10,
            "color": "#00ff00",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        }, //todo убрать взаимодействие с мышкой 
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
        },
        "retina_detect": true
      });
    } else {
      console.error("particlesJS is not defined. Make sure the script is loaded correctly.");
    }
  }, []);

  return (
    <Box
      sx={{
        padding: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.default",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          height: "30vh",
          width: "100%",
          overflow: "hidden",
        }}
      > 
  <div
        id="particles-js"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
      </Box>
      

      <Box sx={{
        position: "relative",
        width: "250px",
        height: "250px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          top: -50,
          left: -50,
          right: -50,
          bottom: -50,
          background: "radial-gradient(circle, rgba(10, 166, 110, 0.3) 0%, rgba(10, 166, 110, 0) 48%)",
          animation: "pulse 2s infinite ease-in-out",
          zIndex: 1,
        },
        "@keyframes pulse": {
          "0%": {
            opacity: 0.6,
            transform: "scale(0.95)",
          },
          "50%": {
            opacity: 1,
            transform: "scale(1)",
          },
          "100%": {
            opacity: 0.6,
            transform: "scale(0.95)",
          },
        },
      }}>
        <Box
          sx={{
            zIndex: 2,
            width: 126,
            height: 126,
            backgroundColor: "#1F2322",
            borderRadius: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 2,
            "&::before": {
              content: '""',
              position: "absolute",
              top: -60,
              left: -50,
              right: -50,
              bottom: -50,
              background: "radial-gradient(circle, rgba(255, 184, 49, 0.3) 0%, rgba(255, 184, 49, 0) 25%)",
              zIndex: 1,
            },
          }}
        >
          <img src={require("../assets/images/Group.png")} alt="Premium" />
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mt: -6, zIndex: 2, position: "relative" }}>
        Get <span style={{ color: "#0AA66E", fontWeight: "600" }}>Professional</span> Plan
      </Typography>
      
      <Typography variant="h6" color="#fff" gutterBottom sx={{ zIndex: 2, position: "relative" }}>
        $49,99/month
      </Typography>
      
      <Typography variant="body1" textAlign="center" sx={{ mb: '32px', color: "#FFFFFFA3", zIndex: 2, position: "relative" }}>
        More messages on our most powerful model with premium features
      </Typography>
      
      <Box sx={{ width: "100%", mb: 3, backgroundColor: "background.paper", borderRadius: "16px", padding: "16px", zIndex: 2, position: "relative" }}>
        {["Early access to new features", 
          "Access to GPT-4o, GPT-4o mini, GPT-4", 
          "Access to advanced data analysis, file uploads, vision, and web browsing",
          "DALL-E image generation",
          "Create and use custom GPTs"].map((feature, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <CheckIcon sx={{ color: "#4caf50", mr: 1, fontSize: 20 }} />
            <Typography variant="body2">{feature}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UpgradePage;

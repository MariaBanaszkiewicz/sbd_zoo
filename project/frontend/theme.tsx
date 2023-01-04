import { extendTheme } from "@chakra-ui/react";

const breakpoints = {
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  breakpoints,
  fonts: {
    body: "Inter, sans-serif",
  },
    components: {
      Button: {
        baseStyle: {
          transition: "all .25s ease-in-out",
          borderRadius: "5px",
          fontWeight: "600",
          _disabled: {
            pointerEvents: "none",
            cursor: "default",
          },
        },
        sizes: {
          md: {
            p: "10px 30px",
            fontSize: "14px",
            lineHeight: 1.2,
          },
        },
        variants: {
          solid: {
            bg: "green.600",
            color: "white",
            _hover: {
              bg: "green.700",
            },
            _groupHover: {
              bg: "green.700",
            },
            _focus: {
              boxShadow: "none",
              bg: "green.700",
            },
            _active: {
              bg: "green.700",
            },
            _groupActive: {
              bg: "green.700",
            },
          },
          outline: {
            bg: "red.500",
            color: "white",
            _hover: {
              bg: "red.600",
            },
            _groupHover: {
              bg: "red.600",
            },
            _focus: {
              boxShadow: "none",
              bg: "red.600",
            },
            _active: {
              bg: "red.600",
            },
            _groupActive: {
              bg: "red.600",
            },
          }
        },
      },
      Menu: {
        parts: ["item", "command", "list", "button", "groupTitle", "divider"],
        baseStyle: {
          item: {
            fontSize: "13px",
            color: "#000000",
            borderRadius: "5px",
            px: "15px",
            _hover: {
              bg: "gray.100",
            },
            _active: {
              bg: "gray.100",
            },
            _focus: {
              bg: "gray.100",
            },
          },
          list: {
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            outline: "none",
            border: 0,
            minW: "200px",
          },
        },
      },
      Popover: {
        parts: ["popper", "content", "header", "body", "footer", "arrow"],
        baseStyle: {
          content: {
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            borderWidth: 0,
            _focus: {
              boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            },
          },
          body: {
            fontSize: "13px",
            px: "15px",
          },
        },
      },
      Heading: {
        baseStyle: {
          lineHeight: "1.2",
        },
        sizes: {
          sm: {
            color: "gray.700",
            fontWeight: "600",
            fontSize: "15px",
            mb: "15px",
          },
          md: {
            color: "gray.700",
            fontWeight: "600",
            fontSize: "18px",
            mb: "20px",
          },
          lg: {
            color: "gray.700",
            fontWeight: "500",
            fontSize: "22px",
          },
        },
        variants: {
          blue: {
            color: "green.500",
          },
        },
      },
      Breadcrumb: {
        parts: ["link", "separator"],
        baseStyle: {
          link: {
            color: "gray.700",
            fontWeight: "500",
            fontSize: "22px",
            _hover: {
              textDecoration: "none",
            },
            _focus: {
              boxShadow: "none",
            },
          },
        },
      },
      Input: {
        parts: ["field", "addon"],
        sizes: {
          md: {
            addon: {
              fontSize: "13px",
            },
            field: {
              fontSize: "13px",
              padding: "10px 15px",
              borderRadius: "3px",
              lineHeight: "1.2",
            },
          },
        },
        variants: {
          unstyled: {
            field: {
              backgroundColor: "#FFFFFF",
              borderWidth: "1px",
              borderColor: "gray.300",
              _focus: {
                borderColor: "green.500",
              },
              _disabled: {
                bg: "gray.100",
              },
              _readOnly: {
                cursor: "default",
                pointerEvents: "none",
              },
              _invalid: {
                borderColor: "green.500",
              },
            },
          },
        },
        defaultProps: {
          variant: "unstyled",
        },
      },
      NumberInput: {
        parts: ["root", "field", "stepperGroup", "stepper"],
        baseStyle: {
          stepper: {
            borderColor: "gray.300",
            _active: {
              bg: "gray.300",
            },
          },
        },
        sizes: {
          md: {
            field: {
              fontSize: "13px",
              py: "10px",
              pl: "15px",
              borderRadius: "3px",
              lineHeight: "1.2",
            },
            stepper: {
              fontSize: "8px",
              _first: {
                borderTopRightRadius: "3px",
              },
              _last: {
                borderBottomRightRadius: "3px",
              },
            },
          },
        },
        variants: {
          unstyled: {
            field: {
              backgroundColor: "#FFFFFF",
              borderWidth: "1px",
              borderColor: "gray.300",
              _focus: {
                borderColor: "green.500",
              },
              _disabled: {
                bg: "gray.100",
              },
              _readOnly: {
                cursor: "default",
                pointerEvents: "none",
              },
              _invalid: {
                borderColor: "green.500",
              },
            },
          },
        },
        defaultProps: {
          variant: "unstyled",
        },
      },
      Select: {
        parts: ["field", "icon"],
        sizes: {
          md: {
            field: {
              fontSize: "13px",
              py: "10px",
              pl: "15px",
              borderRadius: "3px",
              lineHeight: "1.2",
            },
            stepper: {
              fontSize: "8px",
              _first: {
                borderTopRightRadius: "3px",
              },
              _last: {
                borderBottomRightRadius: "3px",
              },
            },
          },
        },
        variants: {
          unstyled: {
            field: {
              backgroundColor: "#FFFFFF",
              borderWidth: "1px",
              borderColor: "gray.300",
              _focus: {
                borderColor: "green.500",
              },
              _disabled: {
                bg: "gray.100",
              },
              _readOnly: {
                cursor: "default",
                pointerEvents: "none",
              },
              _invalid: {
                borderColor: "green.500",
              },
            },
          },
        },
        defaultProps: {
          variant: "unstyled",
        },
      },
      Textarea: {
        sizes: {
          md: {
            fontSize: "13px",
            borderRadius: "3px",
            lineHeight: "1.2",
            paddingInlineEnd: "15px",
            paddingInlineStart: "15px",
            pt: "10px",
            pb: "10px",
          },
        },
        variants: {
          unstyled: {
            backgroundColor: "#FFFFFF",
            borderWidth: "1px",
            borderColor: "gray.300",
            resize: "none",
            _focus: {
              borderColor: "green.500",
            },
            _disabled: {
              bg: "gray.100",
            },
            _readOnly: {
              cursor: "default",
              pointerEvents: "none",
            },
            _invalid: {
              borderColor: "green.500",
            },
          },
        },
        defaultProps: {
          variant: "unstyled",
        },
      },
      FormLabel: {
        baseStyle: {
          fontWeight: "600",
          color: "gray.700",
          mr: 0,
          mb: "7.5px",
          pb: 0,
          fontSize: "14px",
        },
      },
      FormError: {
        parts: ["text", "icon"],
        baseStyle: {
          text: {
            marginTop: "5px",
            fontSize: "12px",
          },
        },
      },
      Progress: {
        parts: ["label", "track"],
        baseStyle: {
          track: {
            borderRadius: "3px",
          },
        },
      },
      Checkbox: {
        parts: ["container", "control", "label", "icon"],
        baseStyle: {
          control: {
            borderRadius: "3px",
            transition: "all .25s ease-in-out",
            borderWidth: "1px",
            borderColor: "gray.300",
            _focus: {
              borderColor: "green.500",
              boxShadow: "none",
            },
            _disabled: {
              bg: "gray.100",
              borderColor: "gray.300",
              cursor: "default",
            },
            _checked: {
              bg: "green.500",
              borderColor: "green.500",
              _hover: {
                bg: "green.500",
                borderColor: "green.500",
              },
              _focus: {
                borderColor: "green.500",
              },
            },
          },
          container: {
            maxWidth: "100%",
          },
          label: {
            lineHeight: "1.4",
            ml: "10px",
            maxWidth: "calc(100% - 30px)",
            _disabled: {
              cursor: "default",
            },
          },
        },
        sizes: {
          md: {
            control: {
              w: "20px",
              h: "20px",
            },
            label: {
              fontSize: "14px",
            },
          },
        },
      },
      Radio: {
        parts: ["container", "control", "label"],
        baseStyle: {
          control: {
            borderWidth: "1px",
            borderColor: "gray.300",
            transition: "all .25s ease-in-out",
            _hover: {
              bg: "white",
              borderColor: "gray.300",
            },
            _checked: {
              color: "green.500",
              borderColor: "gray.300",
              bg: "white",
              _hover: {
                bg: "white",
                borderColor: "gray.300",
              },
            },
            _focus: {
              boxShadow: "none",
            },
          },
          container: {
            maxWidth: "100%",
          },
          label: {
            lineHeight: "1.4",
            ml: "10px",
            maxWidth: "calc(100% - 30px)",
            _disabled: {
              cursor: "default",
            },
          },
        },
        sizes: {
          md: {
            control: {
              w: "20px",
              h: "20px",
            },
            label: {
              fontSize: "14px",
            },
          },
        },
      },
      Tabs: {
        parts: ["root", "tablist", "tab", "tabpanel", "indicator"],
        baseStyle: {
          tabpanel: {
            px: 0,
            pb: 0,
            pt: "30px",
          },
        },
        variants: {
          enclosed: {
            tab: {
              fontSize: "14px",
              color: "#000000",
              borderTopRadius: "5px",
              _focus: {
                color: "#000000",
                boxShadow: "none",
                bg: "gray.100",
              },
              _selected: {
                color: "#000000",
                bg: "gray.100",
              },
            },
          },
        },
        defaultProps: {
          variant: "enclosed",
        },
      },
      Modal: {
        parts: [
          "dialogContainer",
          "dialog",
          "header",
          "closeButton",
          "body",
          "footer",
        ],
        baseStyle: {
          dialog: {
            borderRadius: "5px",
          },
          header: {
            borderBottomWidth: 1,
            borderBottomColor: "gray.300",
            borderBottomStyle: "solid",
            color: "gray.700",
            fontWeight: "600",
            fontSize: "18px",
            py: "15px",
          },
          body: {
            py: "25px",
          },
          footer: {
            borderTopWidth: 1,
            borderTopColor: "gray.300",
            borderTopStyle: "solid",
          },
        },
      },
      CloseButton: {
        baseStyle: {
          color: "gray.500",
          _focus: {
            boxShadow: "none",
            color: "black",
          },
          _hover: {
            bg: "transparent",
            color: "black",
          },
          _active: {
            bg: "transparent",
            color: "black",
          },
        },
      },
      Alert: {
        parts: ["container", "title", "description", "icon"],
        baseStyle: {
          container: {
            borderRadius: "3px",
          },
        },
        defaultProps: {
          variant: "solid",
        },
      },
      Tooltip: {
        baseStyle: {
          bg: "gray.800",
          boxShadow: "none",
          color: "white",
          fontSize: "13px",
          fontWeight: "normal",
          borderRadius: "3px",
          px: "10px",
          py: "2.5px",
        },
      },
      Link: {
        baseStyle: {
          color: "green.500",
          fontWeight: "500",
          _hover: {
            color: "gray.700",
            textDecoration: "none",
          },
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
  },
);

export default theme;

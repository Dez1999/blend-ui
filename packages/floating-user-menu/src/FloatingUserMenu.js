import React, {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useRef,
  useMemo,
} from "react";

import { useId } from "@reach/auto-id";
import { Portal } from "@blend-ui/modal";
import styled, { css, ThemeProvider } from "styled-components";
import { space } from "styled-system";

import { useTheme, Avatar } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import bxPlanet from "@iconify/icons-bx/bx-planet";
import bxHome from "@iconify/icons-bx/bx-home";
import bxExit from "@iconify/icons-bx/bx-exit";
import bxBell from "@iconify/icons-bx/bx-bell";

const positionVariation = props => {
  //console.log("POS ", props);
  let pos = null;

  if (props.positionOption === "top-left") {
    pos = css`
      top: 0;
      left: 0;
      align-items: flex-start;
    `;
  }
  if (props.positionOption === "top-right") {
    pos = css`
      top: 0;
      right: 0;
      align-items: flex-end;
    `;
  }
  if (props.positionOption === "top-center") {
    pos = css`
      top: 0;
    `;
  }
  if (props.positionOption === "left-middle") {
    pos = css`
      top: 50%;
      left: 0;
      align-items: flex-start;
    `;
  }

  if (props.positionOption === "bottom-left") {
    pos = css`
      bottom: 0;
      left: 0;
      align-items: flex-start;
    `;
  }
  if (props.positionOption === "bottom-right") {
    pos = css`
      bottom: 0;
      right: 0;
    `;
  }
  if (props.positionOption === "bottom-center") {
    pos = css`
      bottom: 0;
    `;
  }
  if (props.positionOption === "right-middle") {
    pos = css`
      right: 0;
      top: 50%;
      align-items: flex-end;
    `;
  }
  if (props.positionOption === "center-middle") {
    pos = css`
      top: 50%;
    `;
  }
  return [pos];
};
const alertVariation = props => {
  //console.log("ALERT ", props);
  let styles = props.theme.componentStyles.alert[props.componentStyle];

  return [styles];
};

const Base = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  /* pointer-events: none; */

  overflow: hidden;
  z-index: 10;
  ${props => props.theme.baseStyles};
  ${space}
`;

const MenuBase = styled.div`
  min-width: 350px;
  background: #f5f8f7;
  box-shadow: -4px 0px 8px rgba(91, 92, 91, 0.1);
  border: 0;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  height: 100vh;
  padding-top: 25px;
  padding-right: 25px;
  z-index: 12;
`;

const IconBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const IconDiv = styled.div`
  margin: 8px;
  justify-content: center;
  height: 24px;
`;
const LabelDiv = styled.div`
  justify-content: center;
  font-weight: 600;
  margin-right: 8px;
`;
const TextDiv = styled.div`
  justify-content: center;
  font-weight: 400;
`;

export const UserMenuContext = createContext({});

function useIsMountedRef() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
}

const ModalDiv = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 11;
  background-color: rgba(30, 29, 29, 0.75);
`;

const Badge = styled.span`
  position: absolute;
  top: ${props => (props.isOpen ? "20px" : "9px")};
  right: ${props => (props.isOpen ? "185px" : "9px")};
  padding: 3.5px 5.5px;
  border-radius: 50%;
  background: red;
  font-size: 10px;
  line-height: 10px;
  color: white;
  font-weight: 700;
`;

/*
const ModalOverlay = props => {
    console.log("OVERLAY ", props);
    const { theme } = useModalContext();
    //console.log("CONTEXT ", theme);
    return (
      <WrapperBox
        position="fixed"
        bg={theme.colors.baseModalBackground || "rgba(30, 29, 29, 0.75)"}
        left="0"
        top="0"
        width="100vw"
        height="100vh"
        zIndex={theme.zIndices["overlay"]}
        {...props}
      />
    );
  };
*/

const UserMenuContextProvider = ({
  offset = "15px",
  id,
  position = "top-right",
  theme,
  children,
}) => {
  const defaultTheme = useTheme();
  theme = theme || defaultTheme;
  const menuContext = useRef(null);
  const [userMenu, setUserMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMountedRef = useIsMountedRef();
  const [avatarWidth, setAvatarWidth] = useState(32);
  const [iconButtons, setIconButtons] = useState([true, false, false, false]);
  //let MenuArea = null

  const uuid = useId();
  const _id = id || uuid;
  const portalId = `blend-usermenu-portal-${_id}`;
  const menuId = `blend-usermenu-${_id}`;
  const root = useRef(null);

  const iconClick = (e, i) => {
    console.log("CLICK ", i);
    let buttons = iconButtons.map(ic => false);

    buttons[i] = true;
    setIconButtons(buttons);
    console.log("ICONS ", iconButtons, buttons);

    //MenuArea = userMenu.options.recentApps;
  };

  useEffect(() => {
    root.current = document.createElement("div");
    root.current.id = portalId;
    document.body.appendChild(root.current);

    return () => {
      if (root.current) document.body.removeChild(root.current);
    };
  }, []);

  const show = useCallback(
    (options = {}) => {
      const id = Math.random().toString(36).substr(2, 9);

      const menuOptions = {
        ...options,
      };

      const menu = {
        id,
        options: menuOptions,
      };

      setUserMenu(menu);
      return menu;
    },
    // [position, remove, timeout, type]
    [],
  );
  /*
  const success = useCallback(
    (message = "", options = {}) => {
      options.type = "success";
      return show(message, options);
    },
    [show],
  );
*/
  /*
  useEffect(() => {
    if (isMountedRef.current) {
      show({});
    }
  }, [isMountedRef]);
*/
  menuContext.current = {
    userMenu,
    show,
  };
  //console.log(alertContext);
  const baseProps = {
    positionOption: position,
    theme,
    /*
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
  */
    id: menuId,
  };

  //filter: drop-shadow(0px 4px 8px rgba(91, 92, 91, 0.25));
  /*
  width: 350px;
height: 1024px;
left: 1090px;
top: 0px;

background: #F5F8F7; const baseWhite = "#F5F8F7";
box-shadow: -4px 0px 8px rgba(91, 92, 91, 0.1);

ikonit
box-shadow: -4px 0px 8px rgba(91, 92, 91, 0.1);
box-shadow: 0px 4px 4px rgba(0, 132, 122, 0.6);

.notification .badge {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 5px 10px;
  border-radius: 50%;
  background: red;
  color: white;
}

*/
  return (
    <UserMenuContext.Provider value={menuContext}>
      {children}
      {root.current && (
        <Portal container={root.current}>
          <ThemeProvider theme={theme}>
            <Base {...baseProps}>
              {userMenu && !isOpen && (
                <React.Fragment>
                  <Avatar
                    src={userMenu.options.avatar}
                    alt={"avatar"}
                    width={avatarWidth}
                    style={{
                      margin: offset,
                      filter: "drop-shadow(0px 4px 8px rgba(91, 92, 91, 0.25))",
                    }}
                    onMouseEnter={e => {
                      setAvatarWidth(42);
                    }}
                    onMouseLeave={e => {
                      setAvatarWidth(32);
                    }}
                    onClick={() => {
                      setAvatarWidth(32);
                      setIsOpen(prev => !prev);
                    }}
                  />
                  <Badge isOpen={false}>{userMenu.options.notifications}</Badge>
                </React.Fragment>
              )}
              {isOpen && (
                <React.Fragment>
                  <ModalDiv
                    onClick={() => {
                      setIsOpen(prev => !prev);
                    }}
                  />
                  <MenuBase>
                    <IconBar>
                      <div
                        style={{
                          borderRadius: "50%",
                          marginLeft: "15px",
                          boxShadow: "0px 4px 4px rgba(0, 132, 122, 0.6)",
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #E6E8ED 100%)",
                        }}
                      >
                        <BlendIcon
                          iconify={bxBell}
                          color={"#00847A"}
                          onClick={e => iconClick(e, 0)}
                        />
                      </div>
                      <Badge isOpen={true}>
                        {userMenu.options.notifications}
                      </Badge>
                      <div
                        style={{
                          borderRadius: "50%",
                          marginLeft: "15px",
                          boxShadow: "-4px 0px 8px rgba(91, 92, 91, 0.1)",
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #E6E8ED 100%)",
                        }}
                      >
                        <BlendIcon
                          iconify={bxExit}
                          color={"#00847A"}
                          onClick={e => iconClick(e, 1)}
                        />
                      </div>
                      <div
                        style={{
                          borderRadius: "50%",
                          marginLeft: "15px",
                          boxShadow: "-4px 0px 8px rgba(91, 92, 91, 0.1)",
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #E6E8ED 100%)",
                        }}
                      >
                        <BlendIcon
                          iconify={bxPlanet}
                          color={"#00847A"}
                          onClick={e => iconClick(e, 2)}
                        />
                      </div>
                      <div
                        style={{
                          borderRadius: "50%",
                          marginLeft: "15px",
                          marginRight: "20px",
                          boxShadow: "-4px 0px 8px rgba(91, 92, 91, 0.1)",
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #E6E8ED 100%)",
                        }}
                      >
                        <BlendIcon
                          iconify={bxHome}
                          color={"#00847A"}
                          onClick={() => {
                            setIsOpen(prev => !prev);
                          }}
                        />
                      </div>
                      <Avatar
                        src={userMenu.options.avatar}
                        alt={"avatar"}
                        width={32}
                        style={{
                          filter:
                            "drop-shadow(0px 4px 8px rgba(91, 92, 91, 0.25))",
                        }}
                      />
                    </IconBar>
                    {iconButtons[0] && <div>Notifications</div>}
                    {iconButtons[1] && <div>Exit</div>}
                    {iconButtons[2] && (
                      <div>
                        <userMenu.options.RecentApps />
                      </div>
                    )}
                  </MenuBase>
                </React.Fragment>
              )}
            </Base>
          </ThemeProvider>
        </Portal>
      )}
    </UserMenuContext.Provider>
  );
};

/* Hook */
// ==============================
export const useUserMenu = () => {
  const menuContext = useContext(UserMenuContext);
  console.log("CONTEXT ", menuContext);
  const menu = useMemo(() => {
    return menuContext.current;
  }, [menuContext]);
  return menu;
};

/* @component */
export default UserMenuContextProvider;
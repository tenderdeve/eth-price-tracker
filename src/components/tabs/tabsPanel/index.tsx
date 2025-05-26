import React, { useState, useEffect } from "react";
import style from "./style.module.scss";

interface Tab {
  id: string;
  component?: any;
  disabled?: boolean;
  isActive?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTabId?: any;
  showTabsOnBottom?: boolean;
  setActiveTab?: (tabId: string) => void;
  onTabChange?: (tabId: string) => void;
  styleProps?: React.CSSProperties;
  tabHeight?: string;
  tabStyle?: React.CSSProperties;
}

export const TabsPanel: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  showTabsOnBottom,
  setActiveTab,
  onTabChange,
  styleProps,
  tabHeight,
  tabStyle,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    activeTabId.id || "1d"
  );

  useEffect(() => {
    if (selectedTab !== activeTabId) {
      setActiveTab?.(selectedTab);
      onTabChange?.(selectedTab);
    }
  }, [selectedTab, activeTabId, setActiveTab, onTabChange]);

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
  };

  return (
    <div
      className={style["tab-container"]}
      style={styleProps ? { ...styleProps } : {}}
    >
      {!showTabsOnBottom && (
        <div
          style={tabStyle ? { ...tabStyle } : {}}
          className={style["tab-bar"]}
        >
          {tabs.map((tab) => (
            <button
              className={`${style["tab"]} ${
                tab.id === selectedTab ? style["selected"] : ""
              }`}
              style={{
                color: tab.id === selectedTab ? "#fff" : "#6F7177",
                background: tab.id === selectedTab ? "#4B40EE" : "transparent",
                borderRadius: tab.id === selectedTab ? "10px" : "0px",
              }}
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled || false}
            >
              {tab.id}
            </button>
          ))}
        </div>
      )}
      <div
        style={{
          height: tabHeight || "",
          overflowY: tabHeight ? "scroll" : "inherit",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              display: tab.id === selectedTab ? "block" : "none",
              marginBottom: showTabsOnBottom ? "20px" : "0px",
            }}
          >
            {tab.component}
          </div>
        ))}
      </div>
      {showTabsOnBottom && (
        <div className={style["tab-bar"]}>
          {tabs.map((tab) => (
            <div key={tab.id} className={style["tab-wrapper"]}>
              <button
                className={`${style["tab"]} ${
                  tab.id === selectedTab ? style["selected"] : ""
                }`}
                style={{
                  color: tab.id === selectedTab ? "#000D3D" : "#FFF",
                  background: tab.id === selectedTab ? "white" : "transparent",
                  border: tab.id === selectedTab ? "transparent" : "white",
                  borderRadius: tab.id === selectedTab ? "12px" : "0px",
                }}
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                disabled={tab.disabled || false}
              >
                {tab.id}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CREATE TABLE users (
                       id NUMBER PRIMARY KEY,  -- PK
                       userid VARCHAR2(100),  -- UserID 또는 User 닉네임
                       password VARCHAR2(100),  -- 패스워드
                       nickname VARCHAR2(100),   -- 닉네임
                       realname VARCHAR2(100)      -- 실제 사용자 이름
);

 -- 원하시는대로 밑에 내용은 변경하세요.
INSERT INTO users (id, userid, password, nickname, realname) VALUES (1, 'dusqo', '123456', '연배', '강연배');
INSERT INTO users (id, userid, password, nickname, realname) VALUES (2, 'wldn', '1234', '지우지우', '이지우');


CREATE TABLE recyclingcenters (
                                  ID NUMBER PRIMARY KEY,
                                  NAME VARCHAR2(255),
                                  OPERATIONTYPE VARCHAR2(100),
                                  ADDRESS VARCHAR2(255),
                                  ADDRESSOLD VARCHAR2(255),
                                  LATITUDE NUMBER,
                                  LONGITUDE NUMBER,
                                  AREA NUMBER,
                                  ESTABLISHEDDATE VARCHAR2(255),
                                  VEHICLECOUNT NUMBER,
                                  MAINTIMES VARCHAR2(255),
                                  OPERATINGORGANIZATION VARCHAR2(255),
                                  PHONE VARCHAR2(100),
                                  REPRESENTATIVE VARCHAR2(100),
                                  WEEKDAYSTART VARCHAR2(10),
                                  WEEKDAYEND VARCHAR2(10),
                                  HOLIDAYSTART VARCHAR2(10),
                                  HOLIDAYEND VARCHAR2(10),
                                  OFFDAYINFO VARCHAR2(255),
                                  AFTERSERVICEINFO VARCHAR2(255),
                                  WEBSITE VARCHAR2(255),
                                  MANAGEMENTPHONE VARCHAR2(100),
                                  MANAGEMENTORGANIZATION VARCHAR2(255),
                                  DATADATE VARCHAR2(255),
                                  PROVIDERCODE VARCHAR2(50),
                                  PROVIDERNAME VARCHAR2(255)
);

CREATE SEQUENCE RECYCLING_CENTER_ID_SEQ START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER recycling_center_before_insert
BEFORE INSERT ON recyclingcenters
FOR EACH ROW
BEGIN
SELECT RECYCLING_CENTER_ID_SEQ.NEXTVAL INTO :new.ID FROM dual;
END;


CREATE TABLE ZERO (
                      id NUMBER PRIMARY KEY,
                      latitude VARCHAR2(100),
                      longitude VARCHAR2(100),
                      name VARCHAR2(200)
);

CREATE OR REPLACE TRIGGER zero_before_insert
BEFORE INSERT ON ZERO
FOR EACH ROW
BEGIN
SELECT zero_seq.NEXTVAL INTO :new.id FROM dual;
END;
--Deletes the final_project DB it already exists
drop database if exists final_project;

--Creates the final_project DB
create database final_project;

--Selects the final_project DB to run the following code
use final_project;

--Creates the Users Table
create table if not exists Users(
UserID int not null,
Username varchar(255),
Pass varchar(255),
Email varchar(255),
Bit boolean,
primary key (UserID)
);

--Creates the Commands Table
create table if not exists Commands(
CommandID int not null,
Command varchar(255),
Name varchar(255),
Promp varchar(255),
Bit boolean,
primary key (CommandID)
);

--Creates the Transcipts Table
create table if not exists Transcripts(
TranscriptID int not null,
UserID int not null,
AudioID int not null,
CommandID int not null,
Transcript text,
Time_Log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
primary key (TranscriptID),
foreign key (UserID) references Users(UserID),
foreign key (CommandID) references Commands(CommandID)
);

--Creates the Audio Table
create table if not exists Audio(
AudioID int not null,
TranscriptID int not null,
UserID int not null,
CommandID int not null,
Audiocontent text,
Time_Log datetime,
primary key (AudioID),
foreign key (UserID) references Users(UserID),
foreign key (CommandID) references Commands(CommandID)
);

--Makes AudioID from the Audio table the FK in the Transcripts table
Alter TABLE Transcripts
add CONSTRAINT FK_AudioID FOREIGN KEY (AudioID) REFERENCES Audio(AudioID);

--Makes TransciptID from the Transcripts table the FK in the Audio table
Alter TABLE Audio
add CONSTRAINT FK_TranscriptID FOREIGN key (TranscriptID) REFERENCES Transcripts(TranscriptID);
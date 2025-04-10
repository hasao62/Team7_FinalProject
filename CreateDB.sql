drop database if exists final_project;

create database final_project;
use final_project;

create table if not exists Users(
UserID int not null,
Username varchar(255),
Pass varchar(255),
Email varchar(255),
Bit boolean,
primary key (UserID)
);

create table if not exists Commands(
CommandID int not null,
Command varchar(255),
Name varchar(255),
Promp varchar(255),
Bit boolean,
primary key (CommandID)
);

create table if not exists Transcripts(
TranscriptID int not null,
UserID int not null,
AudioID int not null,
CommandID int not null,
Transcript text,
Time_Log datetime,
primary key (TranscriptID),
foreign key (UserID) references Users(UserID),
foreign key (CommandID) references Commands(CommandID)
);

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

Alter TABLE Transcripts
add CONSTRAINT FK_AudioID FOREIGN KEY (AudioID) REFERENCES Audio(AudioID);

Alter TABLE Audio
add CONSTRAINT FK_TranscriptID FOREIGN key (TranscriptID) REFERENCES Transcripts(TranscriptID);
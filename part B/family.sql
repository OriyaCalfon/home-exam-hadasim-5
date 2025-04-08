USE family2

--Create tables
CREATE TABLE person (
    person_id int identity primary key,  
    personal_name varchar(25),           
    family_name varchar(25),            
    gender varchar(10) check (gender in ('male', 'female')),     
    father_id int,                         
    mother_id int,                        
    spouse_id int,                       
    foreign key (father_id) references person(person_id),
    foreign key (mother_id) references person(person_id),
    foreign key (spouse_id) references person(person_id)
)


CREATE TABLE family_relationships (
    person_id int,                             
    relative_id int,                          
    connection_type varchar(20) check (connection_type in ('father', 'mother', 'brother', 'sister', 'son', 'daughter', 'spouse Male', 'spouse Female')),
    primary key (person_id, relative_id),
    foreign key (person_id) references person(person_id),
    foreign key (relative_id) references person(person_id)
);


INSERT INTO person (personal_name, family_name, gender, father_id, mother_id, spouse_id) 
VALUES 
('Dan', 'Lev', 'male', NULL, NULL, 2),  -- spouse male
('Yael', 'Lev', 'female', NULL, NULL, 1),  -- spouse female
('Yonatan', 'Lev', 'male', 1, 2, NULL),  -- son
('Orit', 'Lev', 'female', 1, 2, NULL),  -- daughter
('Dvora', 'Berger', 'female', 1, 2, NULL), --married daughter
('Gad', 'Cohen', 'male', NULL, NULL, NULL);


--Exercise 1 /family tree
--Father to person
INSERT INTO family_relationships (person_id, relative_id, connection_type)
SELECT 
    p.person_id, 
    p.father_id AS relative_id, 
    'father' AS connection_type
FROM person p
WHERE p.father_id IS NOT NULL
--(for using query more than one time)
AND NOT EXISTS (
      SELECT 1 
      FROM family_relationships fr
      WHERE fr.person_id = p.person_id 
      AND fr.relative_id = p.father_id
  );

--Mother to person
INSERT INTO family_relationships (person_id, relative_id, connection_type)
SELECT 
    p.person_id, 
    p.mother_id AS relative_id, 
    'mother' AS connection_type
FROM person p
WHERE p.mother_id IS NOT NULL;

--Spouses
INSERT INTO family_relationships (person_id, relative_id, connection_type)
SELECT 
    p.person_id, 
    p.spouse_id AS relative_id, 
    CASE 
        WHEN p.gender = 'male' THEN 'spouse Male' 
        ELSE 'spouse Female' 
    END AS connection_type
FROM person p
WHERE p.spouse_id IS NOT NULL;


--Siblings
INSERT INTO family_relationships (person_id, relative_id, connection_type)
SELECT 
    p1.person_id, 
    p2.person_id AS relative_id, 
    CASE
        WHEN p1.gender = 'male' THEN 'brother'
        ELSE 'sister'
    END AS connection_type
FROM person p1
JOIN person p2 ON p1.father_id = p2.father_id AND p1.mother_id = p2.mother_id
WHERE p1.person_id <> p2.person_id;


--Son or daughter to father 
INSERT INTO family_relationships (person_id, relative_id, connection_type)
SELECT 
    p.father_id AS person_id,  
    p.person_id AS relative_id, 
    CASE 
        WHEN p.gender = 'male' THEN 'son'
        WHEN p.gender = 'female' THEN 'daughter'
    END AS connection_type
FROM person p
WHERE p.father_id IS NOT NULL;


--Son or daughter to mother
INSERT INTO family_relationships (person_id, relative_id, connection_type)
SELECT 
    p.mother_id AS person_id,  
    p.person_id AS relative_id, 
    CASE 
        WHEN p.gender = 'male' THEN 'son'
        WHEN p.gender = 'female' THEN 'daughter'
    END AS connection_type
FROM person p
WHERE p.mother_id IS NOT NULL;


--Excersize 2 /completion for spouse
--(triggers)

--Update spouse in person
CREATE TRIGGER update_spouse
ON person
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE p
    SET p.spouse_id = i.person_id
    FROM person p
    JOIN inserted i ON p.person_id = i.spouse_id
    WHERE p.spouse_id IS NULL OR p.spouse_id <> i.person_id;
END;


--Update spouse in family_relationships
CREATE TRIGGER update_family_relationship
ON person
AFTER INSERT, UPDATE
AS
BEGIN
    -- Insert connection from person to spouse
    INSERT INTO family_relationships (person_id, relative_id, connection_type)
    SELECT 
        i.person_id AS person_id,
        i.spouse_id AS relative_id,
        CASE 
            WHEN i.gender = 'male' THEN 'spouse Female' 
            ELSE 'spouse Male' 
        END AS connection_type
    FROM inserted i
    WHERE i.spouse_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 
        FROM family_relationships fr
        WHERE fr.person_id = i.person_id 
        AND fr.relative_id = i.spouse_id
    );

    -- Insert reverse connection from spouse to person
    INSERT INTO family_relationships (person_id, relative_id, connection_type)
    SELECT 
        i.spouse_id AS person_id,
        i.person_id AS relative_id,
        CASE 
            WHEN i.gender = 'male' THEN 'spouse Male' 
            ELSE 'spouse Female' 
        END AS connection_type
    FROM inserted i
    WHERE i.spouse_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 
        FROM family_relationships fr
        WHERE fr.person_id = i.spouse_id 
        AND fr.relative_id = i.person_id
    );
END;



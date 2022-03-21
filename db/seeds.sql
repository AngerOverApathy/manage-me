USE manageMe;

INSERT INTO department (name)
VALUES
('Physician'),
('Nurse'),
('Respiratory Therapist'),
('Pharmacy')
;

INSERT INTO role (title, salary, department_id)
VALUES
('Medical Director', 350000, 1),
('Attending', 200000, 2),
('Resident', 30000, 3),
('Charge RN', 110000, 4),
('RN', 100000, 5),
('Charge RT', 95000, 6),
('RT', 90000, 7),
('Pharmacist',150000, 8)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Chiraag', 'Patel', 1, 1),
('Mohammed', 'Afzal', 2, null),
('Alan', 'Yee', 2, 2),
('Ashley', 'Nguyen', 3, null),
('Megan', 'Lung', 4, 5),
('Lisa', 'Frank', 5, null),
('Steve', 'Banks', 6, 8),
('Louie', 'Natvidad', 7, null),
('Marcus', 'Jones', 8, 9)
;

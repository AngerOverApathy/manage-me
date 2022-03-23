USE manageMe_db;

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
('RN', 100000, 2),
('Charge RT', 95000, 3),
('RT', 90000, 3),
('Pharmacist',150000, 4)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Mohammed', 'Afzal', 2, null),
('Ashley', 'Nguyen', 3, null),
('Lisa', 'Frank', 5, null),
('Louie', 'Natvidad', 7, null),
('Chiraag', 'Patel', 1, 1),
('Alan', 'Yee', 2, 2),
('Megan', 'Lung', 4, 4),
('Steve', 'Banks', 6, 3),
('Marcus', 'Jones', 8, 3)
;

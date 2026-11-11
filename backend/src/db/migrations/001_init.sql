CREATE TABLE users (
  id            serial PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL,
  password_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_key ON users (lower(email));

CREATE TABLE cars (
  id              serial PRIMARY KEY,
  slug            text NOT NULL UNIQUE,
  make            text NOT NULL,
  model           text NOT NULL,
  year            integer NOT NULL,
  category        text NOT NULL,
  seats           integer NOT NULL CHECK (seats > 0),
  fuel            text NOT NULL,
  transmission    text NOT NULL,
  efficiency_kmpl numeric(4, 1) NOT NULL,
  price_per_day   integer NOT NULL CHECK (price_per_day > 0),
  city            text NOT NULL,
  color           text NOT NULL,
  image           text NOT NULL,
  description     text NOT NULL,
  features        text[] NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- end_date is the return day and is exclusive: [start_date, end_date)
CREATE TABLE bookings (
  id          serial PRIMARY KEY,
  user_id     integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  car_id      integer NOT NULL REFERENCES cars (id) ON DELETE RESTRICT,
  start_date  date NOT NULL,
  end_date    date NOT NULL,
  total_price integer NOT NULL CHECK (total_price > 0),
  status      text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date > start_date)
);
CREATE INDEX bookings_car_dates_idx ON bookings (car_id, start_date, end_date) WHERE status = 'confirmed';
CREATE INDEX bookings_user_idx ON bookings (user_id);

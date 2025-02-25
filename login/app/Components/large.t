<Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Name"
                        fullWidth
                        margin="normal"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />

                  {/* Email Field */}
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email format",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        margin="normal"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />

                  {/* Password Field */}
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
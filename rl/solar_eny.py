import gym
import numpy as np

class SolarEnv(gym.Env):
    """
    Custom Environment that follows gym interface.
    This is a simple model of a solar power system where
    - State space is continuous, representing the amount of stored energy.
    - Action space is discrete, representing different operational strategies.
    """
    def __init__(self):
        super(SolarEnv, self).__init__()
        # Define action and observation space
        # They must be gym.spaces objects
        self.action_space = gym.spaces.Discrete(4)  # e.g., 0=store, 1=use, 2=sell, 3=adjust panel angle
        self.observation_space = gym.spaces.Box(low=np.array([0]), high=np.array([100]), dtype=np.float32)

        # Example for internal state
        self.state = 50 + np.random.normal(0, 10)  # Start with some random amount of energy

    def step(self, action):
        # Execute one time step within the environment
        if action == 0:
            # Store energy
            self.state += np.random.rand() * 10
        elif action == 1:
            # Use energy
            self.state -= np.random.rand() * 8
        elif action == 2:
            # Sell energy
            self.state -= np.random.rand() * 5
        elif action == 3:
            # Adjust panel, just a placeholder action
            self.state += np.random.rand() * 2
        
        self.state = np.clip(self.state, 0, 100)  # Ensure state stays within limits

        # Calculate reward (just a placeholder)
        reward = self.state - np.abs(self.state - 50)  # Reward is higher closer to 50 units of energy
        done = False

        return np.array([self.state]).astype(np.float32), reward, done, {}

    def reset(self):
        # Reset the state of the environment to an initial state
        self.state = 50 + np.random.normal(0, 10)
        return np.array([self.state]).astype(np.float32)

    def render(self, mode='human', close=False):
        # Render the environment to the screen
        print(f"Current energy level: {self.state}")

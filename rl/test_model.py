import gym
from stable_baselines3 import PPO
from solar_env import SolarEnv

def main():
    # Create the environment
    env = SolarEnv()

    # Instantiate the agent
    model = PPO('MlpPolicy', env, verbose=1)

    # Train the agent
    model.learn(total_timesteps=20000)

    # Save the model
    model.save("ppo_solar_optimization")

    # Demonstration of the trained model
    obs = env.reset()
    for i in range(100):
        action, _states = model.predict(obs, deterministic=True)
        obs, rewards, dones, info = env.step(action)
        env.render()

if __name__ == "__main__":
    main()

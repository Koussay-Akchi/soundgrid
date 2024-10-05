# SoundGrid 🎵
An interactive sound grid where users can compose simple musical patterns by toggling individual cells in a grid. 

Each row represents a step in time (2 seconds), and each column corresponds to a different musical note. As the playback line moves across the grid, it triggers the notes in the active cells. 

## 👉 [Live website](https://soundgrid.web.app/)
<div style="display: flex; gap: 20px;">
    <img src="/soundgrid.png" alt="screenshot" height="300">
</div>

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Koussay-Akchi/soundgrid.git
   ```

2. Navigate to the project directory:

   ```bash
   cd soundgrid
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:5173/`.

## Usage

- Click on any box to activate/deactivate it.
- The moving line triggers sound playback for the active boxes in the current row.
- Click the reset button to clear the grid and stop all sounds.

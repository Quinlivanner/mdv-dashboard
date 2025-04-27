const express = require("express");
const axios = require("axios");
const exec = require("child_process").exec;
const app = express();
const port = 3559;
const { spawn } = require("child_process");

app.use(express.json());

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    const parts = command.split(" ");
    const cmd = parts.shift();
    const args = parts;

    const child = spawn(cmd, args, { shell: true });

    // Listen for data events (stdout)
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    // Listen for data events (stderr)
    child.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    // Listen for the 'close' event
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command '${command}' failed with exit code ${code}`));
      }
    });
  });
}

app.post("/deploy", (req, res) => {
  res.sendStatus(200);
  const util = require("util");
  const exec = util.promisify(require("child_process").exec);

  async function updateAndRestart() {
    try {
      let messageContent;

      if (req.body.ref.includes("main")) {
        // Step 1: pull the code
        await executeCommand("cd /home/ubuntu/mdv-dashboard && git pull");

        // Step 2: Build the new Docker image
        await executeCommand(
          "sudo docker build -t mdv-app:1.0 /home/ubuntu/mdv-dashboard",
        );

        try {
          // Step 3: Stop the running container
          await executeCommand("sudo docker stop mdv-app");

          // Step 4: Remove the stopped container
          await executeCommand("sudo docker rm mdv-app");
        } catch (error) {}

        // Step 5: Run a new container with the updated image
        await executeCommand(
          "sudo docker run -d --restart=always --name mdv-app -p 0.0.0.0:30001:3000 mdv-app:1.0",
        );

        messageContent = {
          email: "mdv github deployer from server",
          avatar_url:
            "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          embeds: [
            {
              title: `New push in ${req.body.repository.full_name} by ${req.body.sender.login} has been deployed`,
              description: `${req.body.head_commit.message}\n\n view changes on: https://mdv.app`,
              color: 10580736,
              footer: {
                text: "mdv deployer",
                icon_url: req.body.sender.avatar_url,
              },
              fields: [
                {
                  name: "Branch",
                  value: req.body.ref,
                },
                {
                  name: "Modified Files",
                  value: req.body.head_commit.modified.join("\n"),
                },
              ],
            },
          ],
        };
      }else {
        messageContent = {
          msg_type: "text",
          content: {
            text: `New push in ${req.body.repository.full_name} by ${
              req.body.sender.login
            } \ndescription:${req.body.head_commit.message}\nBranch:${
              req.body.ref
            }\nModified Files:${req.body.head_commit.modified.join("\n")}`,
          },
        };
      }
      await axios
        .post(
          "https://discord.com/api/webhooks/1318148903471681536/B_ea5Prjuf5sABinywKqDsIjuwinSJon6aenkGaddbDNsPqmAaHIqgK-43K4qBQuVmNl",
          messageContent,
        )
        .then(() => {
          console.log("Message sent to Discord");
        })
        .catch((error) => {
          console.error("Error sending message to Discord", error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  updateAndRestart();
});

app.listen(port, () => {
  console.log(`Webhook listener started at http://localhost:${port}`);
});``

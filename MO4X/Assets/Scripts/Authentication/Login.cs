using UnityEngine;
using UnityEngine.Networking;
using TMPro;
using System.Collections;
using UnityEngine.UI;

public class Login : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI loginHelperText;
    [SerializeField] private Button logInButton;
    [SerializeField] private TMP_InputField usernameField;
    [SerializeField] private TMP_InputField passwordField;

    private string authenticationEndpoint;

    private void Start()
    {
        authenticationEndpoint = ConexionController.instance.getConexionEndPoint() + "/login";
    }

    public void OnLoginClick()
    {
        logInButton.interactable = false;
        loginHelperText.text = "Connecting to the server...";
        StartCoroutine(TryLogin());
    }

    private IEnumerator TryLogin()
    {
        string usernameString = usernameField.text.Trim();
        string passwordString = passwordField.text.Trim();

        if (usernameString.Length < 3 || usernameString.Length > 24)
        {
            loginHelperText.text = "Invalid Username";
            logInButton.interactable = true;
            yield break;
        }
        if (passwordString.Length < 3 || passwordString.Length > 32)
        {
            loginHelperText.text = "Invalid Password";
            logInButton.interactable = true;
            yield break;
        }

        WWWForm form = new WWWForm();
        form.AddField("username", usernameString);
        form.AddField("password", passwordString);

        UnityWebRequest loginReq = UnityWebRequest.Post(authenticationEndpoint, form);
        UnityWebRequestAsyncOperation requestHandler = loginReq.SendWebRequest();

        float timeLeft = 10f;
        while (!requestHandler.isDone)
        {
            timeLeft-= Time.deltaTime;

            if (timeLeft < 0)
            {
                break;
            }

            yield return null;
        }

        if (loginReq.result == UnityWebRequest.Result.Success)
        {
            LogInResponse response = JsonUtility.FromJson<LogInResponse>(loginReq.downloadHandler.text);
            if (response.code == 0)
            {
                loginHelperText.text = $"Welcome to MO4X {response.gameAccount.username}.";
                ConexionController.instance.setUser(response.gameAccount);
                SceneController.instance.changeScene("MainMenu");                
            }
            else if (response.code == 1)
            {
                loginHelperText.text = "Invalid Credentials";
                logInButton.interactable = true;
            }
            else
            {
                loginHelperText.text = "Unknown Error";
                logInButton.interactable = true;
            }
        }
        else
        {
            loginHelperText.text = "Unable to connect to the server...";
            logInButton.interactable = true;
        }

        

        yield return null;
    }
}

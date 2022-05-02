using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class Singin : MonoBehaviour
{
    private SignUpInMenu menu;
    [SerializeField] private TextMeshProUGUI singinHelperText;
    [SerializeField] private Button singinButton;
    [SerializeField] private TMP_InputField emailField;
    [SerializeField] private TMP_InputField usernameField;
    [SerializeField] private TMP_InputField passwordField;
    [SerializeField] private TMP_InputField repeatPasswordField;

    private const string PASSWORD_REGEX = "(?=.*[A-Za-z])(?=.*[0-9])(?=.{5,32})";

    private string creationEndapoint = "http://127.0.0.1:13756/singin";

    private void Start()
    {
        menu = FindObjectOfType<SignUpInMenu>();
        creationEndapoint = ConexionController.instance.getConexionEndPoint() + "/singin";
    }

    public void clear()
    {
        singinHelperText.text = "Create your account";
        emailField.text = "";
        usernameField.text = "";
        passwordField.text = "";
        repeatPasswordField.text = "";
        singinButton.interactable = true;
    }

    public void OnSinginClick()
    {
        singinButton.interactable = false;
        singinHelperText.text = "Connecting to the server...";
        StartCoroutine(TrySingin());
    }

    private IEnumerator TrySingin()
    {
        string emailString = emailField.text.Trim();
        string usernameString = usernameField.text.Trim();
        string passwordString = passwordField.text.Trim();
        string repeatPasswordString = repeatPasswordField.text.Trim();

        if (usernameString.Length < 3 || usernameString.Length > 24)
        {
            singinHelperText.text = "Invalid Username";
            singinButton.interactable = true;
            yield break;
        }
        if (!Regex.IsMatch(passwordString, PASSWORD_REGEX) || passwordString.Length > 32)
        {
            singinHelperText.text = "Invalid Password";
            singinButton.interactable = true;
            yield break;
        }
        if (passwordString != repeatPasswordString)
        {
            singinHelperText.text = "Your password don't match";
            singinButton.interactable = true;
            yield break;
        }
        if (!IsValidEmail(emailString))
        {
            singinHelperText.text = "Your email is not a valid one";
            singinButton.interactable = true;
            yield break;
        }


        WWWForm form = new WWWForm();
        form.AddField("email", emailString);
        form.AddField("username", usernameString);
        form.AddField("password", passwordString);

        UnityWebRequest singinRequest = UnityWebRequest.Post(creationEndapoint, form);
        UnityWebRequestAsyncOperation requestHandler = singinRequest.SendWebRequest();

        float timeLeft = 15f;
        while (!requestHandler.isDone)
        {
            timeLeft -= Time.deltaTime;

            if (timeLeft < 0)
            {
                break;
            }

            yield return null;
        }       

        if (singinRequest.result == UnityWebRequest.Result.Success)
        {
            SingInResponse response = JsonUtility.FromJson<SingInResponse>(singinRequest.downloadHandler.text);

            switch(response.code)
            {
                case 0:
                    singinHelperText.text = $"Account created with. Welcome {response.gameAccount.username}.";
                    singinButton.interactable = true;
                    menu.OnSignInClick();
                    break;
                case 1:
                    singinHelperText.text = "Invalid Credentials";
                    singinButton.interactable = true;
                    break;
                case 2:
                    singinHelperText.text = "This email already exists";
                    singinButton.interactable = true;
                    break;
                case 3:
                    singinHelperText.text = "This Username already exists";
                    singinButton.interactable = true;
                    break;
                case 4:
                    singinHelperText.text = "Password is unsafe";
                    singinButton.interactable = true;
                    break;
                default:
                    singinHelperText.text = "Unknown Error";
                    singinButton.interactable = true;
                    break;
            }
        }
        else
        {
            singinHelperText.text = "Unable to connect to the server...";
            singinButton.interactable = true;
        }



        yield return null;
    }

    private bool IsValidEmail(string email)
    {
        var trimmedEmail = email.Trim();

        if (trimmedEmail.EndsWith("."))
        {
            return false;
        }
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == trimmedEmail;
        }
        catch
        {
            return false;
        }
    }
}
